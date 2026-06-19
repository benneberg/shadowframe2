# Signage Lab Platform v3

> **High-Fidelity Edge Runtime Simulator for B2B Digital Signage.**

Signage Lab Platform v3 provides a virtualized environment for developing and testing Digital Signage applications. It simulates the hardware constraints, storage systems, and kernel behaviors of enterprise-grade signage displays (LG webOS / Samsung Tizen), enabling rapid iteration and remote diagnostics without physical hardware.

## 🚀 Key Features

- **Virtualized Kernel**: A centralized event bus architecture that tracks every system lifecycle event.
- **Hardware Storage Bridge**: Simulated internal and USB storage tiers with "Virtual Append" logging.
- **Maintenance Inspector**: A high-contrast telemetry dashboard with real-time logs, pings, and system status.
- **Identity Vault**: Personnel management with encrypted operator profiles and secure provisioning keys.
- **Provisioning Engine**: Lifecycle orchestration for nodes, including QR-based hardware setup protocols.
- **Sequencer & Player**: Precise media playback orchestration with template-based rendering.

## 🏗️ Architecture Summary

The platform is split into two primary layers:
1. **The Engine (`/engine`)**: A TypeScript-based virtual operating system that handles sequencers, storage bridges, and event routing.
2. **The Console (`/components`)**: A React-based visualization layer for monitoring and interacting with the simulated hardware.

For a deep dive into the system design, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🛠️ Installation

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Run Linter**:
   ```bash
   npm run lint
   ```

## ⚙️ Configuration

Environment variables can be defined in `.env`:
- `GEMINI_API_KEY`: (Optional) For AI-powered signage content generation.
- `VITE_APP_ENV`: Deployment environment (e.g., `production`, `development`).

## 🧪 Testing

Automated testing is currently on the roadmap. See [TESTING_DELTA.md](./TESTING_DELTA.md) for the planned strategy using Vitest and Playwright.

Manual testing can be performed using the **Debug Inspector** in the application, which allows you to:
- Monitor physical kernel logs.
- Clear virtual storage providers.
- Trigger manual pings to simulated nodes.

## 📦 Build & Deployment

### Build
Generates a production-ready SPA in the `dist/` directory:
```bash
npm run build
```

### Deployment
This project is configured for containerized deployment (Cloud Run). Ensure all environment variables are correctly mapped in the deployment manifest.

---

**Signage Lab Platform v3** — *Engineering the future of digital communications.*
