
import { Playlist, Template, TelemetryEvent, PlaylistItem } from '../../types';

export type { Playlist, Template, TelemetryEvent, PlaylistItem };

export interface MediaAsset {
  mediaId: string;
  type: 'video' | 'image' | 'html';
  url: string;
  duration: number;
  localBlobUrl?: string;
  version?: string;
}

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

export type RuntimeEvent = 
  | { type: 'config:update'; payload: PlayerRuntimeConfig }
  | { type: 'asset:ready'; payload: { mediaId: string; blobUrl: string } }
  | { type: 'playback:started'; payload: { mediaId: string } }
  | { type: 'playback:ended'; payload: { mediaId: string } }
  | { type: 'error'; payload: { message: string; code?: string } };
