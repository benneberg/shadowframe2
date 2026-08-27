# TESTING_DELTA.md

## Automated Test Strategy
- **Status:** **Implemented.** Vitest is configured and running as part of the automated CI pipeline.
- **Test Runner:** Vitest (`vitest run`)
- **Configuration:** `vitest.config.ts` with browser API mocks (`tests/setup.ts`)

---

## Test Suites & Coverage

| Subsystem | Test File | Description | Status |
| --------- | --------- | ----------- | ------ |
| **EventBus** | `tests/unit/event-bus.test.ts` | Typed subscriptions, generic listeners, unregistering, error boundary | :white_check_mark: Passing (4/4) |
| **WebOSStorage** | `tests/unit/storage.test.ts` | Atomic writes, reads, virtual append, mock discovery, 0-byte file safety | :white_check_mark: Passing (4/4) |
| **HardwareLogging** | `tests/unit/hardware-logging.test.ts` | Buffered queue, log retrieval, purge, 500-line circular rotation ceiling | :white_check_mark: Passing (3/3) |
| **PlaylistDiff** | `tests/unit/playlist-diff.test.ts` | Playlist reconciliation, addition/removal detection, item mismatches | :white_check_mark: Passing (3/3) |
| **CMS Storage** | `tests/unit/cms-storage.test.ts` | Media lifecycle, device registry, telemetry ring-buffer, default templates | :white_check_mark: Passing (4/4) |

**Total:** 18 passing tests across 5 test suites.

---

## Running Tests

```bash
# Run all unit tests once
npm test

# Run tests in watch mode during development
npx vitest
```

---

## Roadmap & Future E2E Strategy

1. **Playwright Integration**: Planned for End-to-End visual regression testing of the `VirtualPlayer` composite output (Layer 0 video + Layer 1 Shadow DOM).
2. **Mock WebOS Luna Service**: Automated integration testing mocking webOS native `LS2Request` responses.
