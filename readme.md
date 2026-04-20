# Signage Lab Platform

A Full-Stack Digital Signage Ecosystem for high-performance edge execution and cloud orchestration.

## 🚀 Overview

Signage Lab is a dual-purpose platform designed for:
1. **CMS Orchestration**: A modern React-based management interface for media, playlists, templates, and device provisioning.
2. **Edge Runtime Engine**: A deterministic, hardware-accelerated playback engine built to run strictly on TV platforms (Tizen, webOS), Android, and desktop browsers.

---

## 🛠 Project Structure

```text
/
├── components/          # CMS React Components (UI Layer)
├── services/            # CMS Data Services (Storage, Provisioning)
├── engine/              # THE EDGE RUNTIME ENGINE (Platform Core)
│   ├── core/            # Execution Loop & Runtime Bootstrap
│   ├── modules/         # Asset Manager, Sequencer, Shadow Renderer
│   ├── shadow/          # MQTT Device Shadow Client
│   ├── video/           # Dual Video Engine (Zero-Gap)
│   └── types/           # Cross-platform TypeScript definitions
└── App.tsx              # Main Dashboard Entry Point
```

---

## 📺 The Edge Player (The Engine)

The core of the system is the **Edge Runtime Engine** (located in `/engine`). It is decoupled from the CMS React UI and can be exported to run as a standalone application on target hardware.

### Key Capabilities:
- **Zero-Gap Video**: Dual-slot (A/B) decoding system ensures broadcast-grade transitions without black frames.
- **Offline-First**: Powered by an IndexedDB Asset Manager that caches all media locally as Blobs.
- **Cloud-Synced**: Uses an MQTT-based Device Shadow for real-time state reconciliation.
- **Hybrid Rendering**: Combines hardware-accelerated video background with a secure Shadow DOM overlay for templates.

---

## 🏗 CMS Orchestrator

The CMS provides a high-fidelity control plane for content operators.

### Modules:
- **Media Library**: Manage high-resolution image and video assets.
- **Playlist Builder**: Sequence media with custom durations and template assignments.
- **Template Manager**: Author dynamic HTML/CSS/JS overlays using standard web technologies.
- **Provisioning**: Register new hardware identities and deploy configurations.
- **Virtual Player**: A built-in simulator that instantiates a real Edge Runtime instance for testing.

---

## 🚦 Getting Started

1. **Provision a Player**: Go to the "Provision" tab and create a new Player ID.
2. **Add Media**: Upload URLs to the Media Library.
3. **Build Playlist**: Create a playlist and add your media items.
4. **Boot Engine**: Go to the "Engine" tab, select your Device, and click "Boot System".

---

## 📄 License
Internal Lab Platform - Research & Development.
