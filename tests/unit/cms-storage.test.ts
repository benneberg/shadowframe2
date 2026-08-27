import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../../services/storage';
import { Media, Playlist, Device } from '../../types';

describe('CMS Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default templates when storage is empty', () => {
    const templates = storage.getTemplates();
    expect(templates.length).toBeGreaterThanOrEqual(1);
    expect(templates[0]).toHaveProperty('templateId');
    expect(templates[0]).toHaveProperty('html');
    expect(templates[0]).toHaveProperty('css');
  });

  it('manages media lifecycle (create, get, delete)', () => {
    const mockMedia: Media = {
      mediaId: 'm-1',
      name: 'Hero Promo',
      type: 'image',
      duration: 10,
      url: 'https://example.com/hero.jpg',
      previewUrl: 'https://example.com/hero-thumb.jpg',
      createdAt: new Date().toISOString()
    };

    expect(storage.getMedia()).toEqual([]);
    storage.saveMedia(mockMedia);
    expect(storage.getMedia()).toHaveLength(1);
    expect(storage.getMedia()[0].name).toBe('Hero Promo');

    storage.deleteMedia('m-1');
    expect(storage.getMedia()).toHaveLength(0);
  });

  it('manages device lifecycle (create, get, delete)', () => {
    const mockDevice: Device = {
      deviceId: 'dev-001',
      name: 'Lobby Display 1',
      platform: 'webOS',
      model: 'webOS Commercial Signage',
      status: 'online',
      ipAddress: '192.168.1.100',
      lastSeen: new Date().toISOString(),
      assignedPlaylistId: 'play-1'
    };

    storage.saveDevice(mockDevice);
    expect(storage.getDevices()).toHaveLength(1);
    expect(storage.getDevices()[0].model).toBe('webOS Commercial Signage');

    storage.deleteDevice('dev-001');
    expect(storage.getDevices()).toHaveLength(0);
  });

  it('manages telemetry ring-buffer', () => {
    storage.addTelemetry({
      playerId: 'dev-001',
      timestamp: new Date().toISOString(),
      type: 'HEARTBEAT',
      data: { cpu: 22 }
    });

    expect(storage.getTelemetry()).toHaveLength(1);
    storage.clearTelemetry();
    expect(storage.getTelemetry()).toHaveLength(0);
  });
});
