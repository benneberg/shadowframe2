# Technical Architecture Documentation

This document provides a deep dive into the engineering principles and implementation details of the **Signage Lab Edge Platform**.

---

## 1. Edge Runtime Engine (The "Core")

The engine is built as a modular, event-driven TypeScript framework designed for 24/7 unattended execution.

### 🎥 Dual Video Engine (`/engine/video/DualVideoEngine.ts`)
Achieves zero-gap playback by managing two `<video>` elements in a slot-based architecture:
- **Slot A / Slot B**: While one video plays, the next is preloaded in the inactive slot.
- **Opacity/Z-Index Swap**: Transitions are handled via CSS opacity (150ms) to prevent reflow.
- **Decoder Stability**: Unused decoders are released (`pause` + `removeAttribute` + `load`) to prevent hardware crashes on low-memory TV chipsets.
- **ReadyState Gating**: Uses `canplaythrough` and `readyState >= 3` monitoring for deterministic start triggers.

### 📦 Asset Manager (`/engine/modules/AssetManager.ts`)
Ensures offline-first reliability:
- **IndexedDB Storage**: Stores media as binary Blobs to bypass browser cache limits.
- **Blob URLs**: Media is served via `URL.createObjectURL` to ensure zero-latency local playback.
- **Predictive Preloading**: The Sequencer signals the Asset Manager to "warm" the next asset in the playlist before it's needed.

### 📡 Synchronizer (`/engine/shadow/DeviceShadowClient.ts`)
Implements an AWS-style MQTT Device Shadow:
- **Broker**: Communicates via WebSockets (default: `test.mosquitto.org`).
- **State Model**: Tracks `desired` (cloud) vs `reported` (local) state.
- **Delta Processing**: Only applies the diff between current and target state to minimize network overhead.
- **Version Tracking**: Prevents race conditions and out-of-order message processing.

---

## 2. Rendering Strategy

### Shadow DOM Hybrid Compositor
Instead of using iframes (which are heavy and hard to control), the engine uses a **Layered Compositor**:
- **Layer 0 (Hardened Video)**: Native video elements for maximum hardware acceleration.
- **Layer 1 (Shadow DOM Overlay)**: Template content is rendered inside a `ShadowRoot` on the engine container. This provides style encapsulation and high-performance DOM updates.
- **Layer 2 (UI/Error)**: Standard DOM overlay for diagnostics and debug tools.

---

## 3. Playback Lifecycle

1. **Bootstrap**: Runtime initializes AssetManager (IDB) and VideoEngine.
2. **Sync**: ShadowClient connects and hydrates the local configuration.
3. **Preload**: AssetManager downloads all initial playlist items.
4. **Loop**:
   - `Sequencer` picks next item.
   - `AssetManager` provides local Blob URL.
   - `VideoEngine` prepares inactive slot.
   - `Renderer` updates Shadow DOM with template data.
   - **Switch**: VideoEngine swaps A/B slots.
   - `Sequencer` schedules next tick using performance-aware logic.

---

## 4. Hardware Compatibility

The architecture is explicitly designed for compatibility with:
- **Samsung Tizen (SSSP)**: Optimized for browser-based WGT apps.
- **LG webOS**: Handled via standard HTML5 media hooks.
- **Android TV / Fire Stick**: High-performance WebView execution.
- **Raspberry Pi**: Optimized for Chromium in kiosk mode.

---

## 5. Security Model

- **Media Isolation**: All media is fetched from trusted sources and validated locally.
- **Template Sandboxing**: Shadow DOM provides CSS/JS scoping.
- **MQTT Encryption**: Built to support TLS-secured MQTT connections for production deployments.
