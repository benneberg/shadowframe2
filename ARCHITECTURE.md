# ARCHITECTURE.md — Signage Lab Platform v3

## HIGH-LEVEL ARCHITECTURE
The system follows a modular "Clean Engine" architecture. It strictly separates the **Rendering Layer** (React/Tailwind) from the **Simulation Engine** (TypeScript/Event-Driven). The Engine acts as a virtual operating system, while the UI acts as a maintenance and visualization console.

## COMPONENT BREAKDOWN

### 1. The Kernel (Engine Core)
- **Runtime.ts**: The central coordinator. Initializes all modules, sets up the internal event loop, and starts the system heartbeats.
- **EventBus.ts**: A high-speed, pub/sub communication channel. Every action in the system (playback start, storage write, network ping) is emitted as a `RuntimeEvent`.
- **HealthMonitor.ts**: Tracks CPU/Memory heuristics (simulated) and maintains the node's online/offline status.

### 2. Physical Abstraction Layer (PAL)
- **WebOSStorage.ts**: A bridge that virtualizes the LG webOS storage API. It maps simulated paths (e.g., `/logs/kernel.log`) to browser-based persistence.
- **HardwareLoggingModule.ts**: A singleton that intercepts the `EventBus` stream and performs "Virtual Append" operations to maintain a persistent audit trail.

### 3. Orchestration & UI
- **Sequencer.ts**: Manages the playlist logic. It calculates timing, handles media transitions, and notifies the `VideoEngine`.
- **VirtualPlayer.tsx**: The visual stage. It renders the simulated screen output based on the active template and playlist item.
- **DebugInspector.tsx**: The telemetry console. It pulls from the `HardwareLoggingModule` and `EventBus` to provide a real-time diagnostic view.

## DATA FLOW

### Playback Cycle
1. `Sequencer` determines the next media item.
2. `Sequencer` emits `playback:started` via `EventBus`.
3. `HardwareLoggingModule` captures the event and writes to `WebOSStorage`.
4. `VirtualPlayer` responds to the `EventBus` and updates the visual DOM.

### Source of Truth
- **Primary Source**: `localStorage` (via `storage.ts` and `WebOSStorage.ts`). 
- **State Management**: React `useState` for UI reactivity; Singleton instance variables for Engine state. (Confidence: High)

## EXTERNAL INTEGRATIONS
- **QR Code Generation**: Uses `qrcode.react` for hardware setup simulation.
- **DiceBear API**: Used for dynamic operator profile pictures.
- **Mock LS2 Calls**: The `WebOSStorage` includes placeholders for future LG webOS Luna Service calls. (Confidence: High)

## DEPLOYMENT MODEL
- **Current**: Single-page application (SPA) deployed via Vite.
- **Infrastructure**: Hosted on Cloud Run (per system metadata).
- **CI/CD**: The project includes `npm run build` and `npm run lint` for standard automated validation. (Confidence: High)

## OBSERVABILITY MODEL
The system is self-observing by design:
- **Telemetry**: Real-time heartbeat and "link status" monitoring.
- **Physical Logs**: Durable file-based logs accessible via the Debug Inspector.
- **Debug CLI**: A virtual command line in the inspector for manual kernel intervention.

## ARCHITECTURAL RISKS
1. **Synchronous I/O**: Currently, every kernel event triggers a synchronous write to `localStorage`. Under high load, this will block the main UI thread.
2. **Memory Leaks**: The singleton initialization in `Runtime.ts` lacks defensive "unmount" logic, which could lead to duplicate event listeners during hot-reloads. (Confidence: High)

## RECOMMENDED IMPROVEMENTS
1. **Worker-Based Engine**: Move the core `Runtime` and `HardwareLoggingModule` to a Web Worker to ensure media playback never stutters due to I/O or telemetry processing.
2. **IndexedDB Migration**: Replace `localStorage` with `IndexedDB` for virtual storage to support larger log files and binary media caching.
3. **Circular Buffers**: Implement automatic log rotation to keep virtual storage within a 5MB safety bound.
