
import { RuntimeEvent } from '../types';

type EventHandler<T extends RuntimeEvent['type']> = (payload: Extract<RuntimeEvent, { type: T }>['payload']) => void;

export class EventBus {
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  on<T extends RuntimeEvent['type']>(type: T, handler: EventHandler<T>): void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }

  off<T extends RuntimeEvent['type']>(type: T, handler: EventHandler<T>): void {
    const list = this.handlers.get(type);
    if (list) {
      this.handlers.set(type, list.filter(h => h !== handler));
    }
  }

  subscribe(handler: (event: any) => void): () => void {
    const wrapper = (payload: any) => handler(payload);
    // Generic subscriber for any internal event
    this.on('playback:started', wrapper);
    this.on('playback:ended', wrapper);
    this.on('error', wrapper);
    
    return () => {
      this.off('playback:started', wrapper);
      this.off('playback:ended', wrapper);
      this.off('error', wrapper);
    };
  }

  emit<T extends RuntimeEvent['type']>(type: T, payload: Extract<RuntimeEvent, { type: T }>['payload']): void {
    const list = this.handlers.get(type);
    if (list) {
      list.forEach(handler => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`[EventBus] Error in handler for ${type}:`, err);
        }
      });
    }
  }
}

export const eventBus = new EventBus();
