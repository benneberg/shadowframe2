// Auto-extracted TypeScript type definitions
// Generated: 2026-08-27 18:19 UTC
// Types annotated with 'used in:' show cross-file import relationships.


// -- engine/types/index.ts --
export interface MediaAsset {
  mediaId: string;
  type: 'video' | 'image' | 'html';
  url: string;
  duration: number;
  localBlobUrl?: string;
  version?: string;
}
// used in: engine/modules/AssetManager.ts, engine/modules/ShadowRenderer.ts

export interface ShadowState {
  desired: {
    playlist: Playlist;
    syncTime?: number;
  };
  reported: {
    playlistVersion: string;
    status: 'idle' | 'loading' | 'playing' | 'error';
    health: string;
    currentMediaId?: string;
    memoryUsage?: number;
    lastSyncTime?: number;
  };
}

export interface PlayerRuntimeConfig {
  playerId: string;
  playlist: Playlist;
  template: Template;
}
// used in: components/VirtualPlayer.tsx, engine/core/Runtime.ts, engine/modules/Sequencer.ts

export type RuntimeEvent = 
  | { type: 'config:update';
// used in: engine/core/EventBus.ts, engine/modules/HardwareLoggingModule.ts


// -- types.ts --
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
// used in: components/Dashboard.tsx, components/MediaLibrary.tsx, components/PlaylistBuilder.tsx, components/ProvisioningView.tsx, services/storage.ts

export interface Template {
  templateId: string;
  name: string;
  html: string;
  css: string;
  js: string;
  createdAt: string;
}
// used in: components/PlaylistBuilder.tsx, components/ProvisioningView.tsx, components/TemplateLayoutPreview.tsx, components/TemplatesManager.tsx, engine/modules/ShadowRenderer.ts (+2 more)

export interface PlaylistItem {
  mediaId: string;
  duration: number;
  type: 'video' | 'image' | 'html';
  url: string;
}
// used in: engine/modules/AssetManager.ts, engine/modules/PlaylistDiffEngine.ts, engine/modules/Sequencer.ts, engine/modules/ShadowRenderer.ts, engine/types/index.ts

export interface Playlist {
  playlistId: string;
  name: string;
  items: PlaylistItem[];
  templateId: string;
  createdAt: string;
}
// used in: components/Dashboard.tsx, components/DeviceRegistry.tsx, components/PlaylistBuilder.tsx, components/ProvisioningView.tsx, engine/types/index.ts (+1 more)

export interface Device {
  deviceId: string;
  name: string;
  platform: string;
  model: string;
  ipAddress: string;
  lastSeen: string;
  status: 'online' | 'attention' | 'offline';
  location?: { lat: number; lng: number };
  latency?: number;
  assignedPlaylistId?: string;
}
// used in: components/Dashboard.tsx, components/DeviceRegistry.tsx, components/ProvisioningView.tsx, services/storage.ts

export interface User {
  username: string;
  email: string;
  profilePicture?: string;
  password?: string;
  createdAt: string;
}
// used in: components/Dashboard.tsx, components/UserProfile.tsx, services/storage.ts

export interface PlayerConfig {
  playerId: string;
  playlist: Playlist;
  template: Template;
  lastProvisioned: string;
}
// used in: components/Dashboard.tsx, components/ProvisioningView.tsx, components/VirtualPlayer.tsx, services/storage.ts

export interface TelemetryEvent {
  timestamp: string;
  type: 'HEARTBEAT' | 'PLAYBACK_START' | 'PLAYBACK_END' | 'ERROR' | 'DEBUG_CMD' | 'KERNEL_INIT';
  playerId: string;
  data: any;
}
// used in: components/DebugInspector.tsx, components/VirtualPlayer.tsx, engine/types/index.ts, services/storage.ts

export type ViewState = 'home' | 'media' | 'playlist' | 'templates' | 'devices' | 'debug' | 'provision' | 'player' | 'help' | 'profile';
// used in: App.tsx, components/Dashboard.tsx, components/DebugInspector.tsx, components/DeviceRegistry.tsx, components/HelpCenter.tsx (+6 more)

export interface WebOSStorageProvider {
  driveId: string;
  storageType: 'internal' | 'usb' | 'sdcard' | 'network';
  path: string;
  label?: string;
}
// used in: components/DebugInspector.tsx, engine/modules/WebOSStorage.ts

export interface WebOSFileRequest {
  storageType: string;
  driveId: string;
  path: string;
}
// used in: engine/modules/WebOSStorage.ts
