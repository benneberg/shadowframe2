# TODO.md

# Phase 1 — Core Functionality
- [x] **[HardwareLoggingModule]** Implement virtual `appendFile` logic
- [x] **[DebugInspector]** Fix JSX character literal issue and log styling
- [x] **[ProvisioningView]** Add 'Generate Setup QR' modal rendering device JSON config via `qrcode.react`
- [x] **[ProvisioningView]** Implement 'Ping' diagnostic tool simulating edge node network round-trip latency
- [x] **[TemplatesManager]** Build SVG/CSS visual layout structure preview component with interactive sandbox mode
- [x] **[WebOSStorage]** Complete Luna Service (LS2) integration for `listStorageProviders` and `device/copy`

# Phase 2 — Reliability & Performance
- [x] **[HardwareLoggingModule]** Move to async memory-buffered writes to eliminate main-thread `localStorage` I/O jank
- [x] **[HardwareLoggingModule]** Enforce circular log rotation (capped at 500 lines) to prevent browser quota overflow
- [x] **[Runtime]** Refactor listener registration to be idempotent and clean up `shadow:update` handlers on `destroy()`

# Phase 3 — Production Readiness & UX
- [x] **[UserProfile]** Complete account synchronization, avatar generation, and cipher protocol validation
- [x] **[Storage]** Synchronize default multi-zone signage templates (Fullscreen HUD, Split 70/30, L-Bar Ticker)

# Phase 4 — Future Planned Enhancements
- [ ] **[Multi-Node]** Add cluster orchestration view for managing 100+ simulated players across regional fleets
  Priority: P3 | Impact: High | Effort: XL
- [ ] **[Diagnostics]** Add remote screenshot capture (canvassing the VirtualPlayer DOM)
  Priority: P2 | Impact: Medium | Effort: M

