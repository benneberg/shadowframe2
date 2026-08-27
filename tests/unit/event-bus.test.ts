import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../../engine/core/EventBus';

describe('EventBus', () => {
  it('registers and emits typed events', () => {
    const bus = new EventBus();
    const handler = vi.fn();

    bus.on('playback:started', handler);
    bus.emit('playback:started', { mediaId: 'item-1' });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ mediaId: 'item-1' });
  });

  it('unregisters handlers with off()', () => {
    const bus = new EventBus();
    const handler = vi.fn();

    bus.on('playback:ended', handler);
    bus.emit('playback:ended', { mediaId: 'item-2' });
    expect(handler).toHaveBeenCalledTimes(1);

    bus.off('playback:ended', handler);
    bus.emit('playback:ended', { mediaId: 'item-2' });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('supports generic subscription and unsubscribes cleanly', () => {
    const bus = new EventBus();
    const handler = vi.fn();

    const unsubscribe = bus.subscribe(handler);
    bus.emit('playback:started', { mediaId: 'item-3' });
    bus.emit('error', { message: 'Video stream stalled' });

    expect(handler).toHaveBeenCalledTimes(2);

    unsubscribe();
    bus.emit('playback:started', { mediaId: 'item-4' });
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('handles errors inside handlers without crashing event emission', () => {
    const bus = new EventBus();
    const faultyHandler = vi.fn(() => {
      throw new Error('Handler exploded');
    });
    const goodHandler = vi.fn();

    bus.on('error', faultyHandler);
    bus.on('error', goodHandler);

    expect(() => {
      bus.emit('error', { message: 'Failure' });
    }).not.toThrow();

    expect(faultyHandler).toHaveBeenCalledTimes(1);
    expect(goodHandler).toHaveBeenCalledTimes(1);
  });
});
