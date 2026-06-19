# TODO.md

# Phase 1 — Make It Work
- [x] **[HardwareLoggingModule]** Implement virtual `appendFile` logic
- [x] **[DebugInspector]** Fix JSX character literal issue at line 245
- [ ] **[WebOSStorage]** Implement real `device/list` call for LG webOS (LS2)
  Priority: P1 | Effort: M | Evidence: `WebOSStorage.ts` line 40

# Phase 2 — Make It Reliable
- [ ] **[HardwareLoggingModule]** Move to buffered/async writing to avoid I/O jank
  Priority: P0 | Impact: High | Effort: M | Evidence: `AUDIT.md` Performance Review
- [ ] **[Runtime]** Refactor `init()` to be idempotent (single-subscription check)
  Priority: P1 | Impact: Medium | Effort: S | Evidence: `Runtime.ts:31`

# Phase 3 — Make It Production Ready
- [ ] **[Auth]** Integrate Firebase Auth or JWT validation for UserProfile
  Priority: P2 | Impact: High | Effort: L | Evidence: `UserProfile.tsx` (Mock state)
- [ ] **[Storage]** Implement circular logging/log rotation (max 1MB per file)
  Priority: P1 | Impact: Medium | Effort: S | Evidence: `WebOSStorage.ts`

# Phase 4 — Future Enhancements
- [ ] **[Multi-Node]** Add cluster orchestration view for managing 100+ simulated players
  Priority: P3 | Impact: High | Effort: XL
- [ ] **[Diagnostics]** Add remote screenshot capture (canvassing the VirtualPlayer)
  Priority: P2 | Impact: Medium | Effort: M
