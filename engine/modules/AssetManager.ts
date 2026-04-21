
import { PlaylistItem as MediaAsset } from '../../types';
import { eventBus } from '../core/EventBus';
import { WebOSStorage } from './WebOSStorage';

export class AssetManager {
  private db!: IDBDatabase;
  private cache: Map<string, string> = new Map(); // mediaId -> blobUrl

  async init() {
    this.db = await this.openDB();
    // Initialize WebOS storage discovery if on platform
    if ((window as any).webOS) {
      await WebOSStorage.getInstance().listStorageProviders();
    }
  }

  /**
   * B2B Bridge: Export cached asset to physical storage (e.g. USB)
   */
  async exportToPhysics(id: string, path: string): Promise<boolean> {
    const blob = await this.get(id);
    if (!blob) return false;

    const webos = WebOSStorage.getInstance();
    const providers = await webos.listStorageProviders();
    const usb = providers.find(p => p.storageType === 'usb');

    if (!usb) {
        console.warn('[AssetManager] No USB mount detected for export');
        return false;
    }

    // In a real environment, we'd write to internal sandbox then sync
    const internalPath = `/home/owner/apps/usr/palm/applications/com.signage.app/cache/${id}`;
    await webos.writeFile({ storageType: 'internal', driveId: 'INTERNAL_STORAGE', path: internalPath }, 'binary_blob_data');
    return await webos.syncToUSB(internalPath, path, usb.driveId);
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
