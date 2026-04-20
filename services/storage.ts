
import { Media, Template, Playlist, Device, PlayerConfig, TelemetryEvent } from '../types';

const KEYS = {
  MEDIA: 'signage_media',
  TEMPLATES: 'signage_templates',
  PLAYLISTS: 'signage_playlists',
  DEVICES: 'signage_devices',
  CONFIGS: 'signage_configs',
  TELEMETRY: 'signage_telemetry'
};

const DEFAULT_TEMPLATES: Template[] = [
  {
    templateId: 'temp-001',
    name: 'Standard Fullscreen',
    html: '<div id="player-container" class="fullscreen">\n  <div class="media-wrap">\n    <img src="{{media.url}}" class="content-item" />\n  </div>\n  <div class="overlay">\n    <h1>{{playlist.name}}</h1>\n    <p>Player: {{playerId}}</p>\n  </div>\n</div>',
    css: 'body { margin: 0; background: black; font-family: sans-serif; } \n.fullscreen { width: 100vw; height: 100vh; position: relative; overflow: hidden; }\n.content-item { width: 100%; height: 100%; object-fit: cover; }\n.overlay { position: absolute; bottom: 20px; left: 20px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }',
    js: 'console.log("Template Loaded: Fullscreen Initialized");',
    createdAt: new Date().toISOString()
  }
];

export const storage = {
  getMedia: (): Media[] => JSON.parse(localStorage.getItem(KEYS.MEDIA) || '[]'),
  saveMedia: (media: Media | Media[]): Media[] => {
    const list = storage.getMedia();
    const newList = Array.isArray(media) ? media : [...list.filter(m => m.mediaId !== media.mediaId), media];
    localStorage.setItem(KEYS.MEDIA, JSON.stringify(newList));
    return newList;
  },
  deleteMedia: (id: string): Media[] => {
    const list = storage.getMedia();
    const newList = list.filter(m => m.mediaId !== id);
    localStorage.setItem(KEYS.MEDIA, JSON.stringify(newList));
    return newList;
  },

  getTemplates: (): Template[] => {
    const data = localStorage.getItem(KEYS.TEMPLATES);
    return data ? JSON.parse(data) : DEFAULT_TEMPLATES;
  },
  saveTemplates: (templates: Template[]) => localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(templates)),
  saveTemplate: (template: Template): Template[] => {
    const list = storage.getTemplates();
    const newList = [...list.filter(t => t.templateId !== template.templateId), template];
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(newList));
    return newList;
  },

  getPlaylists: (): Playlist[] => JSON.parse(localStorage.getItem(KEYS.PLAYLISTS) || '[]'),
  savePlaylists: (playlists: Playlist[]) => localStorage.setItem(KEYS.PLAYLISTS, JSON.stringify(playlists)),
  savePlaylist: (playlist: Playlist): Playlist[] => {
    const list = storage.getPlaylists();
    const newList = [...list.filter(p => p.playlistId !== playlist.playlistId), playlist];
    localStorage.setItem(KEYS.PLAYLISTS, JSON.stringify(newList));
    return newList;
  },

  getDevices: (): Device[] => JSON.parse(localStorage.getItem(KEYS.DEVICES) || '[]'),
  saveDevices: (devices: Device[]) => localStorage.setItem(KEYS.DEVICES, JSON.stringify(devices)),
  saveDevice: (device: Device): Device[] => {
    const list = storage.getDevices();
    const newList = [...list.filter(d => d.deviceId !== device.deviceId), device];
    localStorage.setItem(KEYS.DEVICES, JSON.stringify(newList));
    return newList;
  },
  deleteDevice: (id: string): Device[] => {
    const list = storage.getDevices();
    const newList = list.filter(d => d.deviceId !== id);
    localStorage.setItem(KEYS.DEVICES, JSON.stringify(newList));
    return newList;
  },

  getConfigs: (): PlayerConfig[] => JSON.parse(localStorage.getItem(KEYS.CONFIGS) || '[]'),
  saveConfigs: (configs: PlayerConfig[]) => localStorage.setItem(KEYS.CONFIGS, JSON.stringify(configs)),
  saveConfig: (config: PlayerConfig): PlayerConfig[] => {
    const list = storage.getConfigs();
    const newList = [...list.filter(c => c.playerId !== config.playerId), config];
    localStorage.setItem(KEYS.CONFIGS, JSON.stringify(newList));
    return newList;
  },

  getTelemetry: (): TelemetryEvent[] => JSON.parse(localStorage.getItem(KEYS.TELEMETRY) || '[]'),
  addTelemetry: (event: TelemetryEvent) => {
    const logs = storage.getTelemetry();
    logs.unshift(event);
    localStorage.setItem(KEYS.TELEMETRY, JSON.stringify(logs.slice(0, 500)));
  },
  clearTelemetry: () => localStorage.removeItem(KEYS.TELEMETRY)
};
