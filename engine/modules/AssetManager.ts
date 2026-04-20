
import { PlaylistItem as MediaAsset } from '../../types';
import { eventBus } from '../core/EventBus';

export class AssetManager {
  private db!: IDBDatabase;
  private cache: Map<string, string> = new Map(); // mediaId -> blobUrl

  async init() {
    this.db = await this.openDB();
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('signage-assets-v3', 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains('assets')) {
          req.result.createObjectStore('assets');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async store(id: string, blob: Blob) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('assets', 'readwrite');
      tx.objectStore('assets').put(blob, id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async get(id: string): Promise<Blob | null> {
    return new Promise((resolve) => {
      const tx = this.db.transaction('assets');
      const req = tx.objectStore('assets').get(id);
      req.onsuccess = () => resolve(req.result || null);
    });
  }

  async ensureAsset(id: string, url: string) {
    const existing = await this.get(id);
    if (existing) {
      if (!this.cache.has(id)) {
        const blobUrl = URL.createObjectURL(existing);
        this.cache.set(id, blobUrl);
        eventBus.emit('asset:ready', { mediaId: id, blobUrl });
      }
      return;
    }

    try {
      console.log(`[AssetManager] Force-fetching asset: ${url}`);
      const res = await fetch(url);
      const blob = await res.blob();
      await this.store(id, blob);
      const blobUrl = URL.createObjectURL(blob);
      this.cache.set(id, blobUrl);
      eventBus.emit('asset:ready', { mediaId: id, blobUrl });
    } catch (err) {
      console.error(`[AssetManager] Edge download failure ${id}:`, err);
      eventBus.emit('error', { message: `Media download failed: ${id}` });
    }
  }

  async getAsset(asset: MediaAsset): Promise<string> {
    await this.ensureAsset(asset.mediaId, asset.url);
    return this.cache.get(asset.mediaId) || asset.url;
  }

  async preloadNext(id: string, url: string) {
    // Predictive preloader
    this.ensureAsset(id, url).catch(() => {});
  }

  async cleanup(keepMediaIds: string[]) {
    // 🔥 Memory Management: revokeObjectURL
    this.cache.forEach((url, id) => {
      if (!keepMediaIds.includes(id)) {
        URL.revokeObjectURL(url);
        this.cache.delete(id);
      }
    });

    // Cleanup DB
    // (Implementation of DB removal for brevity, but cache is the big memory leak)
  }

  async preloadPlaylist(assets: MediaAsset[]) {
    for (const asset of assets) {
      await this.ensureAsset(asset.mediaId, asset.url);
    }
  }
}
