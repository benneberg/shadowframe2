
import { Media, Template, Playlist, Device, PlayerConfig, TelemetryEvent, User } from '../types';

const KEYS = {
  MEDIA: 'signage_media',
  TEMPLATES: 'signage_templates',
  PLAYLISTS: 'signage_playlists',
  DEVICES: 'signage_devices',
  CONFIGS: 'signage_configs',
  TELEMETRY: 'signage_telemetry',
  USER: 'signage_user'
};

const DEFAULT_TEMPLATES: Template[] = [
  {
    templateId: 'temp-001',
    name: 'Standard Fullscreen HUD',
    html: `<div id="player-container" class="fullscreen">
  <div class="media-wrap">
    <img src="{{media.url}}" class="content-item" />
  </div>
  <div class="overlay">
    <div class="badge">LIVE_BROADCAST</div>
    <h1>{{media.name}}</h1>
    <p>PLAYLIST: {{playlist.name}} | ID: {{playerId}}</p>
  </div>
</div>`,
    css: `body { margin: 0; background: #000; font-family: system-ui, sans-serif; } 
.fullscreen { width: 100vw; height: 100vh; position: relative; overflow: hidden; }
.content-item { width: 100%; height: 100%; object-fit: cover; }
.overlay { position: absolute; bottom: 30px; left: 30px; color: #fff; background: rgba(0,0,0,0.75); padding: 20px 28px; border-radius: 16px; border: 1px solid rgba(0,255,198,0.3); backdrop-filter: blur(12px); max-width: 480px; }
.badge { display: inline-block; background: #00ffc6; color: #000; font-weight: 900; font-size: 10px; padding: 4px 10px; border-radius: 6px; letter-spacing: 2px; margin-bottom: 8px; }
h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.5px; }
p { margin: 0; font-size: 11px; opacity: 0.7; font-family: monospace; }`,
    js: 'console.log("Standard Fullscreen HUD Initialized");',
    createdAt: new Date().toISOString()
  },
  {
    templateId: 'temp-002',
    name: 'Split Screen 70/30 Layout',
    html: `<div class="split-layout">
  <div class="main-media">
    <img src="{{media.url}}" class="content-item" />
  </div>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>SYSTEM_FEED</h2>
      <div class="live-dot"></div>
    </div>
    <div class="widget">
      <span class="label">CURRENT ASSET</span>
      <span class="value">{{media.name}}</span>
    </div>
    <div class="widget">
      <span class="label">NODE ID</span>
      <span class="value">{{playerId}}</span>
    </div>
    <div class="widget">
      <span class="label">CAMPAIGN</span>
      <span class="value">{{playlist.name}}</span>
    </div>
  </div>
</div>`,
    css: `body { margin: 0; background: #050508; font-family: sans-serif; color: #fff; }
.split-layout { display: flex; width: 100vw; height: 100vh; }
.main-media { flex: 7; height: 100%; background: #000; overflow: hidden; }
.content-item { width: 100%; height: 100%; object-fit: cover; }
.sidebar { flex: 3; background: #0d0e15; border-left: 2px solid rgba(0,255,198,0.2); padding: 30px; display: flex; flex-direction: column; gap: 20px; box-sizing: border-box; }
.sidebar-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; }
.sidebar-header h2 { margin: 0; font-size: 14px; font-weight: 900; letter-spacing: 2px; color: #00ffc6; }
.live-dot { width: 10px; height: 10px; background: #00ffc6; border-radius: 50%; box-shadow: 0 0 10px #00ffc6; }
.widget { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; }
.label { display: block; font-size: 9px; font-family: monospace; color: #64748b; letter-spacing: 2px; margin-bottom: 4px; }
.value { font-size: 14px; font-weight: 700; color: #f8fafc; }`,
    js: 'console.log("Split Screen 70/30 Initialized");',
    createdAt: new Date().toISOString()
  },
  {
    templateId: 'temp-003',
    name: 'L-Bar Signage & Ticker',
    html: `<div class="lbar-layout">
  <div class="top-area">
    <div class="media-box">
      <img src="{{media.url}}" class="content-item" />
    </div>
    <div class="side-panel">
      <h3>ANNOUNCEMENTS</h3>
      <p class="panel-text">Welcome to the 2026 Tech Summit. Check schedules on main display.</p>
      <div class="status-tag">ACTIVE_ZONE</div>
    </div>
  </div>
  <div class="bottom-ticker">
    <div class="ticker-badge">NEWS TICKER</div>
    <div class="ticker-text">SYSTEM STATUS: OPTIMAL /// PLAYLIST: {{playlist.name}} /// NODE: {{playerId}} /// ASSET: {{media.name}}</div>
  </div>
</div>`,
    css: `body { margin: 0; background: #000; font-family: sans-serif; color: #fff; }
.lbar-layout { display: flex; flex-direction: column; width: 100vw; height: 100vh; }
.top-area { display: flex; flex: 1; height: calc(100vh - 60px); }
.media-box { flex: 3; background: #111; }
.content-item { width: 100%; height: 100%; object-fit: cover; }
.side-panel { flex: 1; background: #12131e; border-left: 2px solid #7c3aed; padding: 24px; box-sizing: border-box; }
.side-panel h3 { color: #a78bfa; margin-top: 0; font-size: 14px; letter-spacing: 2px; }
.panel-text { font-size: 12px; color: #94a3b8; line-height: 1.6; }
.status-tag { display: inline-block; background: rgba(124,58,237,0.2); border: 1px solid #7c3aed; color: #c4b5fd; font-size: 9px; padding: 4px 10px; border-radius: 6px; }
.bottom-ticker { height: 60px; background: #09090e; border-top: 2px solid #00ffc6; display: flex; align-items: center; padding: 0 20px; gap: 20px; box-sizing: border-box; }
.ticker-badge { background: #00ffc6; color: #000; font-weight: 900; font-size: 10px; padding: 6px 14px; border-radius: 8px; letter-spacing: 2px; }
.ticker-text { font-family: monospace; font-size: 12px; color: #00ffc6; opacity: 0.9; white-space: nowrap; overflow: hidden; }`,
    js: 'console.log("L-Bar Signage Initialized");',
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
  clearTelemetry: () => localStorage.removeItem(KEYS.TELEMETRY),

  getUser: (): User => {
    const data = localStorage.getItem(KEYS.USER);
    if (data) return JSON.parse(data);
    return {
      username: 'benneberg',
      email: 'benneberg@gmail.com',
      createdAt: new Date().toISOString()
    } as User;
  },
  saveUser: (user: User) => localStorage.setItem(KEYS.USER, JSON.stringify(user))
};
