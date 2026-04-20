
export interface Media {
  mediaId: string;
  name: string;
  type: 'video' | 'image' | 'html';
  duration: number;
  tags?: string[];
  url: string;
  previewUrl: string;
  orientation?: 'landscape' | 'portrait';
  resolution?: string;
  createdAt: string;
}

export interface Template {
  templateId: string;
  name: string;
  html: string;
  css: string;
  js: string;
  createdAt: string;
}

export interface PlaylistItem {
  mediaId: string;
  duration: number;
  type: 'video' | 'image' | 'html';
  url: string;
}

export interface Playlist {
  playlistId: string;
  name: string;
  items: PlaylistItem[];
  templateId: string;
  createdAt: string;
}

export interface Device {
  deviceId: string;
  name: string;
  platform: string;
  model: string;
  ipAddress: string;
  lastSeen: string;
  status: 'online' | 'attention' | 'offline';
}

export interface PlayerConfig {
  playerId: string;
  playlist: Playlist;
  template: Template;
  lastProvisioned: string;
}

export interface TelemetryEvent {
  timestamp: string;
  type: 'HEARTBEAT' | 'PLAYBACK_START' | 'PLAYBACK_END' | 'ERROR' | 'DEBUG_CMD' | 'KERNEL_INIT';
  playerId: string;
  data: any;
}

export type ViewState = 'home' | 'media' | 'playlist' | 'templates' | 'devices' | 'debug' | 'provision' | 'player' | 'help';
