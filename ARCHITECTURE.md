# Signage Lab Platform — System Architecture

This document details the engineering architecture, component relationships, data flow, and runtime constraints of the **Signage Lab Platform**.

---

## 1. Architectural Overview

The platform is structured into two decoupled, distinct subsystems:

1. **The Edge Runtime Engine (`/engine`)**: A deterministic, event-driven virtual operating system and playback sequencer built to execute unattended on commercial displays (LG webOS, Samsung Tizen, Android TV, Raspberry Pi).
2. **The CMS Orchestrator (`/components` & `/services`)**: A React 19 / Vite control plane providing fleet operators with media management, dynamic template authoring, visual layout previews, provisioning QR generation, and real-time telemetry inspection.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        CMS ORCHESTRATOR (React 19)                      │
│                                                                         │
│  ┌────────────────┐ ┌─────────────────┐ ┌───────────────┐ ┌───────────┐ │
│  │ Media Library  │ │ PlaylistBuilder │ │TemplateManager│ │Provisioner│ │
│  └────────┬───────┘ └────────┬────────┘ └───────┬───────┘ └─────┬─────┘ │
│           │                  │                  │               │       │
│           └──────────────────┼──────────────────┴───────────────┘       │
│                              ▼                                          │
│                   Local Storage & Services                              │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │ (Hydration / Config)
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     EDGE RUNTIME ENGINE (Decoupled)                     │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │               Central Kernel EventBus (Pub / Sub)               │   │
│   └──┬─────────────┬─────────────┬─────────────────┬────────────┬───┘   │
│      │             │             │                 │            │       │
│      ▼             ▼             ▼                 ▼            ▼       │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐     ┌───────────┐ ┌─────────┐  │
│  │Sequencer │ │VideoEngine││AssetManager│    │ShadowDom  │ │Hardware │  │
│  │          │ │ (A/B     │ │(IndexedDB │     │Renderer   │ │Logging  │  │
│  │          │ │ Decoders)│ │ Blob cache│     │(Overlays) │ │Module   │  │
│  └──────────┘ └──────────┘ └───────────┘     └───────────┘ └────┬────┘  │
│                                                                 │       │
│                                                                 ▼       │
│                                                          ┌────────────┐ │
│                                                          │WebOSStorage│ │
│                                                          │(Virtual    │ │
│                                                          │ Append/LS2)│ │
│                                                          └────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Engine Components

### 2.1 Dual Video Engine (`/engine/video/DualVideoEngine.ts`)
Achieves broadcast-grade zero-gap video playback on constrained hardware through a ping-pong slot architecture:
- **Slot A / Slot B**: While Slot A plays, Slot B buffers and decodes the initial frames of the upcoming asset.
- **Hardware Decoder Conservation**: TV decoders are constrained. The inactive slot safely detaches listeners and halts playback without causing memory leaks.
- **ReadyState Gating**: Transitions only occur once the incoming video achieves `readyState >= 3` (`HAVE_FUTURE_DATA`) or `canplaythrough`.
- **CSS Transitions**: Video switching is performed via opacity crossfades (150ms) to avoid browser layout reflows.

### 2.2 Asset Manager (`/engine/modules/AssetManager.ts`)
Enables offline-first playback and eliminates network latency spikes:
- **IndexedDB Binary Storage**: Downloads remote image and video assets into local IndexedDB object stores as binary Blobs.
- **Blob Object URLs**: Generates ephemeral `blob:` URLs via `URL.createObjectURL`, allowing instant zero-latency playback directly from disk/memory.
- **Predictive Warming**: As the sequencer plays item $N$, the Asset Manager automatically fetches and buffers item $N+1$.

### 2.3 Sequencer (`/engine/modules/Sequencer.ts`)
The playback loop driver:
- **Drift Compensation**: Tracks delta between target duration and `performance.now()` elapsed time to ensure playback timings do not drift over 24/7 loops.
- **Dynamic Diffing (`PlaylistDiffEngine`)**: When a cloud update arrives via Device Shadow, the sequencer diffs the playlist. If the active asset is still present, playback continues uninterrupted with its new order.

### 2.4 Device Shadow Client (`/engine/shadow/DeviceShadowClient.ts`)
Maintains continuous state synchronization between edge nodes and cloud orchestrators:
- Implements AWS IoT-style MQTT Device Shadow semantics (`desired` vs. `reported` states).
- Employs delta calculation so edge displays only download configuration deltas rather than re-downloading entire state trees.

### 2.5 WebOS Storage Bridge & Hardware Logging (`/engine/modules/`)
- **WebOSStorage**: Bridges filesystem operations to LG webOS Luna Service (`luna://com.webos.service.storageaccess`) on physical hardware, or falls back to an isolated virtual storage provider in browser sandboxes.
- **HardwareLoggingModule**: Subscribes to all kernel events. Implements an asynchronous memory write buffer and a circular rotation policy capped at 500 lines to guarantee zero UI jank and prevent `QUOTA_EXCEEDED_ERR`.

---

## 3. Rendering Layers & Compositor

The display viewport uses a three-tier hardware composition model:

```text
┌──────────────────────────────────────────────────────────┐
│ Layer 2: Diagnostics & Kiosk Chrome (Standard DOM)       │
├──────────────────────────────────────────────────────────┤
│ Layer 1: Template Overlay (Isolated Shadow DOM Root)     │
├──────────────────────────────────────────────────────────┤
│ Layer 0: Hardware-Accelerated Video (Slot A & Slot B)    │
└──────────────────────────────────────────────────────────┘
```

1. **Layer 0 (Video Surface)**: Native hardware `<video>` elements for GPU-accelerated video decoding.
2. **Layer 1 (Shadow DOM Overlay)**: HTML/CSS/JS signage templates rendered into an isolated `ShadowRoot`. This sandboxes styles and protects against CSS bleed between templates.
3. **Layer 2 (Diagnostics)**: On-screen telemetry, FPS counters, and network status pills.

---

## 4. Telemetry & Observability

- **EventBus**: Micro-event bus allowing subsystems to communicate without circular dependencies (`playback:started`, `playback:ended`, `error`, `shadow:update`).
- **HealthMonitor**: Periodic heartbeats (10s) gathering node telemetry: memory usage, active playlist, current asset, and storage health.
- **Diagnostic Inspector**: Provides fleet operators with live kernel logs, simulated node pinging, storage provider purging, and emergency reboot controls.

---

## 5. Security & Isolation

- **Encapsulated Templates**: Custom template HTML and CSS run strictly inside the Shadow DOM boundary.
- **Secret Isolation**: All sensitive credentials (`GEMINI_API_KEY`) remain in server/proxy scope and are never embedded into edge player bundles.
- **Storage Namespacing**: Virtual disk paths use isolated keys (`webos_file_...`) preventing collisions with application state.
