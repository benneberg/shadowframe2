# TESTING_DELTA.md

## Automated Test Strategy
- **Status:** **Implemented & Fully Automated.** Both Vitest (Unit/Integration) and Playwright (E2E) run as part of the automated CI/CD pipeline.
- **Unit Test Runner:** Vitest (`npm test`) with jsdom browser environment (`tests/setup.ts`).
- **E2E Test Runner:** Playwright (`npm run test:e2e`) with Chromium automation.
- **Configuration:** `vitest.config.ts` and `playwright.config.ts`.

---

## Test Suites & Coverage

### Unit & Integration Suites (Vitest)

| Subsystem | Test File | Description | Status |
| --------- | --------- | ----------- | ------ |
| **EventBus** | `tests/unit/event-bus.test.ts` | Typed subscriptions, generic listeners, unregistering, error boundary | :white_check_mark: Passing (4/4) |
| **WebOSStorage** | `tests/unit/storage.test.ts` | Atomic writes, reads, virtual append, mock discovery, 0-byte file safety | :white_check_mark: Passing (4/4) |
| **HardwareLogging** | `tests/unit/hardware-logging.test.ts` | Buffered queue, log retrieval, purge, 500-line circular rotation ceiling | :white_check_mark: Passing (3/3) |
| **PlaylistDiff** | `tests/unit/playlist-diff.test.ts` | Playlist reconciliation, addition/removal detection, item mismatches | :white_check_mark: Passing (3/3) |
| **CMS Storage** | `tests/unit/cms-storage.test.ts` | Media lifecycle, device registry, telemetry ring-buffer, default templates | :white_check_mark: Passing (4/4) |
| **Player Compositor** | `tests/unit/player-compositor.test.ts` | ShadowRenderer ShadowRoot injection and DualVideoEngine slot mounting | :white_check_mark: Passing (4/4) |

**Unit Total:** 22 passing tests across 6 test suites.

---

### End-to-End Smoke Suites (Playwright)

| Subsystem | Test File | Description | Status |
| --------- | --------- | ----------- | ------ |
| **Player Viewport** | `tests/e2e/player-viewport.spec.ts` | Edge runtime booting, virtual standby rendering, DualVideo and ShadowRenderer DOM layer mounting | :white_check_mark: Passing (2/2) |
| **Template Composition** | `tests/e2e/template-overlay.spec.ts` | Template catalog archetype badges, Wireframe schematic vs. Live Sandbox iframe toggling, editor code tabs | :white_check_mark: Passing (3/3) |

**E2E Total:** 5 passing browser automation tests across 2 test suites.

---

## Running Tests

```bash
# Run all unit tests
npm test

# Run Playwright End-to-End tests
npm run test:e2e

# Run unit tests in watch mode during development
npx vitest
```

