# Signage Lab Platform — LLM Context & Agent Guide

> **For AI Agents**: Read `.llm-context/context-manifest.json` and this document for codebase orientation.

## Identity & Domain
Signage Lab Platform is an edge runtime simulator and CMS orchestrator for B2B Digital Signage (LG webOS, Samsung Tizen, Android TV, Raspberry Pi). It virtualizes hardware storage tiers, kernel event streams, zero-gap video decoding, and MQTT device shadow synchronization.

## Stack & Architecture
- **Language**: TypeScript 5.8+ (Strict type-checking)
- **UI Framework**: React 19 (Functional components, hooks, Tailwind CSS)
- **Build Tool**: Vite 6 (ESM development, Rollup production bundle)
- **Testing**: Vitest (Unit tests in `/tests/unit/`, run via `npm test`)
- **Key Libraries**:
  - `framer-motion`: High-performance animations and transitions
  - `lucide-react`: Consistent SVG icons
  - `qrcode.react`: Setup and provisioning QR code generation
  - `mqtt`: MQTT client for Device Shadow communication
  - `@dnd-kit`: Drag-and-drop playlist reordering

## Critical Conventions

### 1. Engine & UI Decoupling
- The `/engine/` directory contains the headless virtual signage runtime. It MUST NOT import React components or UI code.
- Communication between the engine and the UI occurs through the `EventBus` (`/engine/core/EventBus.ts`) or `Runtime` lifecycle calls.

### 2. Storage & Memory Safety
- `WebOSStorage` (`/engine/modules/WebOSStorage.ts`) abstracts LG webOS Luna Service calls (`luna://com.webos.service.storageaccess`) and falls back to a sandboxed browser implementation.
- `HardwareLoggingModule` (`/engine/modules/HardwareLoggingModule.ts`) uses an asynchronous in-memory write buffer and enforces a 500-line circular rotation cap to prevent UI jank and `localStorage` quota exceptions.

### 3. Error Handling
- Never throw unhandled exceptions in event bus subscribers. Wrap handler executions in `try / catch` blocks to prevent catastrophic runtime crashes.
- Video decoders must gracefully catch `canplaythrough` / playback rejections and emit an `error` event rather than freezing the sequencer.

## Common Development Tasks

```bash
# Start local dev server (port 3000)
npm run dev

# Run TypeScript typecheck & linter
npm run lint

# Run automated Vitest test suite
npm test

# Build production bundle
npm run build
```

## Repository Map

- `/engine/`: Headless edge player core
  - `/engine/core/`: EventBus, HealthMonitor, Runtime lifecycle
  - `/engine/modules/`: AssetManager, HardwareLoggingModule, WebOSStorage, Sequencer, ShadowRenderer
  - `/engine/shadow/`: DeviceShadowClient (MQTT)
  - `/engine/video/`: DualVideoEngine (zero-gap A/B slot decoding)
  - `/engine/types/`: Internal engine type contracts
- `/components/`: React CMS views and inspector panels
- `/services/`: CMS local storage and device sync services
- `/tests/`: Automated unit tests (Vitest)
- `types.ts`: Global domain interfaces (Media, Playlist, Device, Template)
