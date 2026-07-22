
import { PlayerRuntimeConfig } from '../types';
import { AssetManager } from '../modules/AssetManager';
import { Sequencer } from '../modules/Sequencer';
import { ShadowRenderer } from '../modules/ShadowRenderer';
import { DualVideoEngine } from '../video/DualVideoEngine';
import { DeviceShadowClient } from '../shadow/DeviceShadowClient';
import { HealthMonitor } from './HealthMonitor';
import { Bridge } from '../modules/Bridge';
import { HardwareLoggingModule } from '../modules/HardwareLoggingModule';
import { eventBus } from './EventBus';

export class Runtime {
  private assetManager: AssetManager;
  private sequencer: Sequencer;
  private renderer: ShadowRenderer;
  private videoEngine: DualVideoEngine;
  private shadowClient: DeviceShadowClient;
  private healthMonitor: HealthMonitor;
  private hardwareLogger: HardwareLoggingModule;

  constructor(container: HTMLElement, config: PlayerRuntimeConfig) {
    this.assetManager = new AssetManager();
    this.videoEngine = new DualVideoEngine(container);
    this.renderer = new ShadowRenderer(container);
    this.sequencer = new Sequencer(this.videoEngine, this.renderer, this.assetManager);
    this.shadowClient = new DeviceShadowClient(config.playerId);
    this.healthMonitor = new HealthMonitor();
    this.hardwareLogger = HardwareLoggingModule.getInstance();

    this.hardwareLogger.init();
    this.setupListeners();
    Bridge.init(); // Expose window.SignagePlayer
  }

  async init() {
    this.healthMonitor.start();
    await this.assetManager.init();
    // Pre-start steps
  }

  private handleShadowUpdate = (e: any) => {
    const current = this.sequencer.currentConfig;
    if (e.detail.playlist && current) {
      console.log('[Runtime] Seamlessly applying playlist delta...');
      const newConfig = { ...current, playlist: e.detail.playlist };
      this.sequencer.setConfig(newConfig as any);
    }
    
    if (e.detail.syncTime) {
      // Multi-device sync pulse
      console.log('[Runtime] Synchronizing with leader cluster...');
      // SyncEngine would be used here if fully wired
    }
  };

  private setupListeners() {
    // Media telemetry loop
    eventBus.on('playback:started', ({ mediaId }) => {
      this.shadowClient.updateReported({ 
        status: 'playing', 
        currentMediaId: mediaId,
        health: this.healthMonitor.getHealth()
      });
      
      // Signal to Bridge
      if ((window as any).SignagePlayer?.onMediaChange) {
        // Pass dummy data or full item if we had it
        (window as any).SignagePlayer.onMediaChange({ mediaId });
      }
    });

    // Shadow Sync Loop
    window.addEventListener('shadow:update', this.handleShadowUpdate);

    eventBus.on('error', (err) => {
      console.error('[Runtime] Platform error:', err);
      this.shadowClient.updateReported({ status: 'error' });
    });
  }

  async bootstrap(initialConfig: PlayerRuntimeConfig) {
    console.log(`[Runtime] Bootstrapping Multi-Device Platform Engine [${initialConfig.playerId}]`);
    
    await this.assetManager.init();
    this.healthMonitor.start();

    // Secure Bootstrap sequence
    this.shadowClient.updateReported({ status: 'loading' });
    
    // Warm assets before starting
    await this.assetManager.preloadPlaylist(initialConfig.playlist.items);
    
    this.sequencer.setConfig(initialConfig);
    this.sequencer.start();

    // Establish Shadow link (Hydration barrier handled in client)
    this.shadowClient.connect();
  }

  destroy() {
    window.removeEventListener('shadow:update', this.handleShadowUpdate);
    this.sequencer.stop();
    this.shadowClient.disconnect();
    this.healthMonitor.stop();
    this.assetManager.cleanup([]);
  }
}
