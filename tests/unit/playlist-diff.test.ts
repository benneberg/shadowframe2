import { describe, it, expect } from 'vitest';
import { PlaylistDiffEngine } from '../../engine/modules/PlaylistDiffEngine';
import { PlaylistItem } from '../../types';

describe('PlaylistDiffEngine', () => {
  const itemA: PlaylistItem = {
    mediaId: 'media-1',
    duration: 10,
    type: 'image',
    url: 'https://example.com/1.jpg'
  };
  const itemB: PlaylistItem = {
    mediaId: 'media-2',
    duration: 15,
    type: 'video',
    url: 'https://example.com/2.mp4'
  };
  const itemC: PlaylistItem = {
    mediaId: 'media-3',
    duration: 20,
    type: 'image',
    url: 'https://example.com/3.jpg'
  };

  it('detects no changes when playlists are identical', () => {
    const changes = PlaylistDiffEngine.diff([itemA, itemB], [itemA, itemB]);
    expect(changes).toEqual([]);
  });

  it('detects length mismatch when items are added or removed', () => {
    const changes = PlaylistDiffEngine.diff([itemA], [itemA, itemB]);
    expect(changes).toEqual([{ type: 'length_mismatch' }]);
  });

  it('detects item mismatch at specific index', () => {
    const changes = PlaylistDiffEngine.diff([itemA, itemB], [itemA, itemC]);
    expect(changes).toEqual([{ type: 'item_mismatch', index: 1 }]);
  });
});
