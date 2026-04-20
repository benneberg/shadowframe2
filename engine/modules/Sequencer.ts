
import { PlaylistItem } from '../../types';
import { PlayerRuntimeConfig } from '../types';
import { eventBus } from '../core/EventBus';
import { DualVideoEngine } from '../video/DualVideoEngine';
import { ShadowRenderer } from './ShadowRenderer';
import { AssetManager } from './AssetManager';
import { PlaylistDiffEngine } from './PlaylistDiffEngine';

export class Sequencer {
  private config: PlayerRuntimeConfig | null = null;
  private currentIndex = 0;
  private isRunning = false;
  private timer: any = null;
  private lastTick = 0;
  public get currentConfig() {
    return this.config;
  }

  constructor(
    private videoEngine: DualVideoEngine,
    private renderer: ShadowRenderer,
    private assetManager: AssetManager
  ) {}

  setConfig(config: PlayerRuntimeConfig) {
    if (this.config) {
      const diffs = PlaylistDiffEngine.diff(this.config.playlist.items, config.playlist.items);
      if (diffs.length === 0) return;

      console.log(`[Sequencer] Applying playlist diff: ${diffs.length} changes detected.`);
      
      const currentMediaId = this.config.playlist.items[this.currentIndex]?.mediaId;
      const newIndex = config.playlist.items.findIndex(item => item.mediaId === currentMediaId);
      
      this.config = config;
      if (newIndex !== -1) {
        this.currentIndex = newIndex;
        console.log(`[Sequencer] Seamless synchronized to index ${this.currentIndex}`);
      } else {
        console.log(`[Sequencer] Current media removed. Resetting head.`);
        this.currentIndex = 0;
        if (this.isRunning) this.playNext();
      }
    } else {
      this.config = config;
    }
  }

  async start() {
    if (!this.config || this.config.playlist.items.length === 0) return;
    this.isRunning = true;
    this.lastTick = performance.now();
    console.log('[Sequencer] Starting deterministic playback engine...');
    this.playNext();
  }

  stop() {
    this.isRunning = false;
    if (this.timer) clearTimeout(this.timer);
    this.videoEngine.stop();
    this.renderer.clear();
  }

  private async playNext() {
    if (!this.isRunning || !this.config) return;

    const currentItem = this.config.playlist.items[this.currentIndex];
    const nextItem = this.config.playlist.items[(this.currentIndex + 1) % this.config.playlist.items.length];

    console.log(`[Sequencer] Executing: ${currentItem.mediaId} (${currentItem.type})`);
    
    // 1. Get Blob URL
    const currentUrl = await this.assetManager.getAsset(currentItem);
    
    // 2. Render Overlay (Layer 1)
    this.renderer.renderTemplate(
      this.config.template, 
      currentItem, 
      this.config.playlist.name, 
      this.config.playerId
    );

    // 3. Handle Video Playback (Layer 0)
    if (currentItem.type === 'video') {
      try {
        await this.videoEngine.playNext(currentUrl);
      } catch (err) {
        console.error('[Sequencer] Playback failure:', err);
        eventBus.emit('error', { message: 'Decoder failure, skipping asset' });
      }
    }

    eventBus.emit('playback:started', { mediaId: currentItem.mediaId });

    // 4. Predictive Preload next item
    this.assetManager.preloadNext(nextItem.mediaId, nextItem.url);

    // 5. Drift-Free Timing
    const idealDuration = (currentItem.duration || 10) * 1000;
    const now = performance.now();
    const drift = now - this.lastTick - (this.lastTick === 0 ? 0 : idealDuration);
    const adjustedDuration = Math.max(0, idealDuration - drift);
    this.lastTick = now;

    this.timer = setTimeout(() => {
      eventBus.emit('playback:ended', { mediaId: currentItem.mediaId });
      this.currentIndex = (this.currentIndex + 1) % this.config!.playlist.items.length;
      this.playNext();
    }, adjustedDuration);
  }
}
