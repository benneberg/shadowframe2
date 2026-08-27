# PURPOSE.md — Signage Lab Platform v3

## PRODUCT SUMMARY
Signage Lab Platform v3 is a specialized edge runtime simulator and CMS orchestrator for B2B Digital Signage. It virtualizes the core hardware and kernel capabilities of commercial signage displays (such as LG webOS and Samsung Tizen), allowing developers, system architects, and fleet operators to design, test, and debug complex media playback orchestration without requiring physical hardware.

## PROBLEM STATEMENT
Digital signage development is traditionally bottlenecked by "Hardware Scarcity" and "Deployment Blindness." Testing playback logic, hardware storage persistence, zero-gap video decoding, and telemetry under failure conditions normally requires expensive physical screens and serial-to-USB debugging. This platform solves this by providing a browser-based, high-fidelity replica of the signage runtime, complete with virtualized storage tiers, asynchronous hardware-level event logging, and instant onboarding workflows. (Confidence: High)

## TARGET AUDIENCE
- **Signage Application Developers**: Technical users who need to verify that their playlists, transitions, and local caching logic work according to specific hardware constraints. (Confidence: High)
- **QA & SRE Engineers**: Personnel responsible for maintenance protocols, remote troubleshooting, and simulating "Day 2" failure scenarios (e.g., storage quota exhaustion, communication link loss). (Confidence: High)
- **Fleet Operations & Field Technicians**: Operators who provision devices, generate setup QR codes, and monitor network health across remote display clusters. (Confidence: High)
- **System Architects**: Users prototyping multi-node signage networks or validating edge-to-cloud Device Shadow synchronization. (Confidence: High)

## VALUE PROPOSITION
- **Zero-Hardware Iteration**: Deploy, simulate, and debug signage apps in a standard browser tab.
- **Hardware Archaeology**: Virtualized logging of kernel-level events that are typically invisible in standard web apps.
- **Maintenance Visualization**: A dedicated "Debug Inspector" that surfaces internal telemetry, storage mounts, and network latency in real-time.
- **Deterministic Provisioning**: Quick onboarding via standards-compliant QR codes and ping connectivity tools.

## CORE FEATURES

### Verified (Implemented & Tested)
- **High-Fidelity Sequencer & Dual Video Engine**: Zero-gap video playback using ping-pong A/B slot decoding and drift-compensated timers.
- **Offline-First Asset Manager**: Binary IndexedDB caching with predictive asset warming.
- **Virtualized Hardware Storage & Buffered Logging**: `WebOSStorage` abstraction supporting `internal` and `usb` tiers with an asynchronous memory-buffered queue and 500-line circular rotation ceiling.
- **Visual Template Layout Preview**: Real-time interactive SVG wireframe layout preview in `TemplatesManager`.
- **Provisioning Engine & QR Code Generator**: Modal rendering deterministic node identity JSON configurations via `qrcode.react`.
- **Network Ping Diagnostics**: Live round-trip network latency simulation tool.
- **Device Shadow Synchronization**: MQTT client maintaining desired vs. reported state parity.
- **Automated Quality Tooling**: Comprehensive Vitest unit test suite (18 tests) and GitHub Actions CI matrix workflow.

### Roadmap & Future Capabilities
- **Native Luna Service (LS2) Execution**: Direct mapping of virtual calls to native LG webOS system APIs when packaged as an IPK.
- **Multi-Node Cluster Orchestration**: Managing hundreds of simulated nodes across regional display fleets.
- **Remote Screenshot Diagnostics**: Visual canvas snapshotting of the active composite viewport.
