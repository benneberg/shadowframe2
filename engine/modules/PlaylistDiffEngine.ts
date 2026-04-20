import { PlaylistItem } from '../../types';

export class PlaylistDiffEngine {
  static diff(oldItems: PlaylistItem[], newItems: PlaylistItem[]): any[] {
    const changes: any[] = [];
    if (oldItems.length !== newItems.length) {
      changes.push({ type: 'length_mismatch' });
      return changes;
    }

    for (let i = 0; i < oldItems.length; i++) {
      if (oldItems[i].mediaId !== newItems[i].mediaId) {
        changes.push({ type: 'item_mismatch', index: i });
      }
    }
    return changes;
  }
}
