# Changelog

All notable changes to the Signage Lab Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.0.0] - 2026-08-27

### Added
- **Automated Testing Suite**: Integrated Vitest unit test suite with 18 unit tests covering `EventBus`, `WebOSStorage`, `PlaylistDiffEngine`, `HardwareLoggingModule`, and `services/storage`.
- **GitHub Actions CI Pipeline**: Added automated matrix validation workflow (`.github/workflows/ci.yml`) testing on Node.js 20.x and 22.x LTS.
- **Repository Metadata**: Added `LICENSE` (MIT), `CONTRIBUTING.md`, `SECURITY.md`, `.editorconfig`, `.env.example`, Dependabot config, and PR / issue templates.
- **Template Layout Preview**: Real-time visual layout structure preview using SVG and CSS overlays in `TemplatesManager`.
- **Setup QR Code Generator**: Modal rendering a deterministic JSON blob QR code for instant display node onboarding via `qrcode.react`.
- **Ping Diagnostics**: Real-time simulated round-trip network latency test tool in device inspector.

### Changed
- **Asynchronous Hardware Logging**: Upgraded `HardwareLoggingModule` from synchronous `localStorage` writes to an in-memory buffered write pipeline with a 3-second background flusher.
- **Circular Log Rotation**: Implemented a 500-line ceiling on kernel log persistence to prevent browser `QUOTA_EXCEEDED_ERR`.
- **Storage Bridge Fix**: Fixed `WebOSStorage.readFile()` to return empty strings for valid 0-byte files rather than falsely coercing them to `null`.
- **Standardized Documentation**: Comprehensive overhaul of `README.md`, `ARCHITECTURE.md`, and `LLM.md`.

### Removed
- Redundant lowercase `readme.md` to prevent case-collision hazards on cross-platform checkouts.

---

## [2.0.0] - 2026-08-15

### Added
- **Dual Video Engine**: Slot-based A/B playback pipeline eliminating black frames and transition latency.
- **Offline-First Asset Manager**: IndexedDB binary Blob storage cache with predictive preloading.
- **Device Shadow Client**: Real-time MQTT synchronization for desired vs. reported player states.
- **Layered Compositor**: Isolated Shadow DOM rendering for HTML/CSS/JS signage templates.

---

## [1.0.0] - 2026-07-01

### Added
- Initial release of the Signage Lab simulator and CMS dashboard.
- Virtual player execution environment.
- Media library, playlist sequencer, and telemetry inspector.
