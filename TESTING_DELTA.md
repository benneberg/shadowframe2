# TESTING_DELTA.md

## Existing Test Strategy
- **Status:** **Missing.** No automated tests found in the repository.

## Coverage Gaps
1. **Engine Sequencer (P0):** The core playlist rotation logic.
2. **Storage Bridge (P1):** Verification of virtual append and persistence across reloads.
3. **Asset preloading (P1):** Ensuring assets are fully buffered before playback starts.

---

## RECOMMENDATION: Vitest + Playwright
- **Vitest:** For unit testing engine logic (types, sequencers, bus).
- **Playwright:** For end-to-end testing of the `VirtualPlayer` simulation.

## Directory Structure
```
/tests
  /unit
    sequencer.test.ts
    storage.test.ts
  /e2e
    player.spec.ts
```

## Bootstrap Test Case (`/tests/unit/storage.test.ts`)
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { WebOSStorage } from '../../engine/modules/WebOSStorage';

describe('WebOSStorage', () => {
  beforeEach(() => { localStorage.clear(); });

  it('correctly appends data to a virtual file', async () => {
    const storage = WebOSStorage.getInstance();
    const req = { storageType: 'internal', driveId: 'test', path: '/test.log' };
    
    await storage.writeFile(req, 'line1');
    await storage.appendFile(req, 'line2');
    
    const content = await storage.readFile(req);
    expect(content).toBe('line1\nline2');
  });
});
```

## High-Value Test Cases
1. **Playlist Transition:** Ensure `Sequencer` emits `playback:started` precisely when the previous item ends.
2. **Quota Handling:** Ensure `WebOSStorage` handles `localStorage` errors gracefully and doesn't crash the engine.
3. **Event Bus Isolation:** Ensure events from one `Runtime` instance do not pollute another (especially important for the multi-player roadmaps).
