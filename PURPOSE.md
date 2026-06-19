# PURPOSE.md — Signage Lab Platform v3

## PRODUCT SUMMARY
Signage Lab Platform v3 is a specialized edge runtime simulator for B2B Digital Signage. It virtualizes the core hardware and kernel capabilities of high-end signage displays (such as LG webOS and Samsung Tizen), allowing developers and system architects to design, test, and debug complex media playback orchestration without requiring physical hardware.

## PROBLEM STATEMENT
Digital signage development is traditionally bottlenecked by "Hardware Scarcity" and "Deployment Blindness." Testing playback logic, hardware storage persistence, and telemetry under failure conditions normally requires expensive physical screens and serial-to-USB debugging. This platform solves this by providing a browser-based, high-fidelity replica of the signage runtime, complete with virtualized storage tiers and hardware-level event logging. (Confidence: High)

## TARGET AUDIENCE
- **Signage Application Developers**: Technical users who need to verify that their playlists, transitions, and local caching logic work according to specific hardware constraints. (Confidence: High)
- **QA & SRE Engineers**: Personnel responsible for maintenance protocols, remote troubleshooting, and simulating "Day 2" failure scenarios (e.g., storage quota exhaustion, communication link loss). (Confidence: High)
- **System Architects**: Users prototyping multi-node signage clusters or validating "Identity Vault" security protocols for enterprise deployments. (Confidence: Medium)

## VALUE PROPOSITION
- **Zero-Hardware Iteration**: Deploy and debug signage apps in a standard browser tab.
- **Hardware Archaeology**: Virtualized logging of kernel-level events that are typically invisible in standard web apps.
- **Maintenance Visualization**: A dedicated "Debug Inspector" that surfaces internal telemetry, storage mounts, and network latency in real-time.

## CORE FEATURES

### Verified (Exists in Code)
- **High-Fidelity Sequencer**: Real-time playlist rotation and media lifecycle management.
- **Virtualized Hardware Storage**: Support for `internal` and `usb` storage provider simulations via the `WebOSStorage` bridge.
- **Hardware Kernel Logging**: A persistent logging module that captures every internal system event and commits it to a virtual storage path.
- **Telemetry Dashboard**: High-contrast, design-forward UI for monitoring system health, heartbeats, and network status.
- **Identity Vault**: A mock user profile and account synchronization interface for operator personnel.

### Inferred (Incomplete implementation)
- **Provisioning Flow**: A UI exists for node registration and configuration, though current persistence is tied to browser state rather than a remote server. (Confidence: High)
- **B2B Security Protocols**: Visual cues for "Cipher Protocols" and "Cryptographic Hashing" exist, though actual implementation is currently stubbed/mocked. (Confidence: High)

### Future (From Roadmap)
- **Luna Service (LS2) Integration**: Direct mapping of virtual calls to native LG webOS system APIs.
- **Remote Cluster Orchestration**: Managing hundreds of simulated nodes from a single dashboard.
- **Buffered I/O**: Offloading hardware logging to async workers for production-scale performance.
