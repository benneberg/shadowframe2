import { describe, it, expect, beforeEach } from 'vitest';
import { WebOSStorage } from '../../engine/modules/WebOSStorage';

describe('WebOSStorage Bridge', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('correctly writes and reads a virtual file', async () => {
    const storage = WebOSStorage.getInstance();
    const req = { storageType: 'internal', driveId: 'INTERNAL_STORAGE', path: '/test.log' };

    const writeSuccess = await storage.writeFile(req, 'hello webos');
    expect(writeSuccess).toBe(true);

    const content = await storage.readFile(req);
    expect(content).toBe('hello webos');
  });

  it('correctly appends data to a virtual file using virtual append', async () => {
    const storage = WebOSStorage.getInstance();
    const req = { storageType: 'internal', driveId: 'INTERNAL_STORAGE', path: '/audit.log' };

    await storage.writeFile(req, 'entry 1');
    const appendSuccess = await storage.appendFile(req, 'entry 2');
    expect(appendSuccess).toBe(true);

    const content = await storage.readFile(req);
    expect(content).toBe('entry 1\nentry 2');
  });

  it('returns null for non-existent files', async () => {
    const storage = WebOSStorage.getInstance();
    const req = { storageType: 'internal', driveId: 'INTERNAL_STORAGE', path: '/missing.txt' };

    const content = await storage.readFile(req);
    expect(content).toBeNull();
  });

  it('lists default storage providers in mock/browser environment', async () => {
    const storage = WebOSStorage.getInstance();
    const providers = await storage.listStorageProviders();
    expect(providers.length).toBeGreaterThanOrEqual(1);
    expect(providers.some(p => p.storageType === 'internal')).toBe(true);
  });
});
