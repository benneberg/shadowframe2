# Signage Lab Platform v3

> **High-Fidelity Edge Runtime Simulator & CMS Orchestrator for B2B Digital Signage.**

[![CI Pipeline](https://github.com/signagelab/platform/actions/workflows/ci.yml/badge.svg)](https://github.com/signagelab/platform/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Tested-729B1B.svg?logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Signage Lab Platform provides a high-fidelity virtualized environment for designing, testing, and debugging enterprise Digital Signage applications. It simulates the hardware constraints, storage systems, and kernel behaviors of commercial signage displays (LG webOS and Samsung Tizen), enabling rapid iteration and remote diagnostics without physical hardware.

---

## 🚀 Key Capabilities

- **Zero-Gap Dual Video Engine**: Slot-based (A/B) decoding pipeline eliminating black frames and transition latency on commercial displays.
- **Layered Compositor**: Template overlays rendered inside an isolated `ShadowRoot` over hardware-accelerated video surfaces.
- **Offline-First Storage**: IndexedDB binary Blob storage cache with predictive preloading for resilient offline playback.
- **Hardware Storage Bridge**: Virtualized internal and USB storage tiers with asynchronous write buffering and a 500-line circular rotation ceiling.
- **Visual Template Layout Previews**: Interactive SVG and CSS wireframe preview component for multi-zone signage layouts (Fullscreen HUD, Split 70/30, L-Bar).
- **Setup QR Provisioning**: Instant QR code generation emitting standardized node identity JSON payloads for fleet onboarding.
- **Real-Time Network Diagnostics**: Ping testing tool simulating edge node network round-trip latency.
- **Device Shadow Reconciliation**: AWS IoT-style MQTT device shadow client synchronizing desired vs. reported player configurations.

---

## 🏗️ Architecture Summary

The repository is cleanly split into two decoupled subsystems:

```text
/
├── engine/              # HEADLESS EDGE RUNTIME (Decoupled Platform Core)
│   ├── core/            # Execution loop, Runtime lifecycle, Central EventBus
│   ├── modules/         # AssetManager, HardwareLoggingModule, WebOSStorage, Sequencer
│   ├── shadow/          # MQTT Device Shadow Client
│   ├── video/           # Dual Video Engine (Zero-Gap A/B Switcher)
│   └── types/           # Cross-platform TypeScript definitions
├── components/          # CMS OPERATOR CONSOLE (React 19 Presentation Layer)
├── services/            # CMS Data Services (IndexedDB, LocalStorage, Telemetry)
├── tests/               # Automated unit test suite (Vitest)
└── .github/             # CI/CD workflows, Dependabot, Issue & PR templates
```

For complete system design and data flow diagrams, refer to [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 🚦 Quick Start

### Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **npm**: v10.x or higher

### Installation & Launch

1. **Clone the repository and install dependencies**:
   ```bash
   git clone https://github.com/<your-org>/signage-lab-platform.git
   cd signage-lab-platform
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to access the console.

---

## ⚙️ Environment Configuration

Environment variables are documented in [`.env.example`](./.env.example):

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional | API key for AI-assisted signage templates and content generation | *None* |
| `VITE_APP_ENV` | Optional | Deployment environment (`development`, `production`, `test`) | `development` |

---

## 🧪 Quality Tooling & Automated Verification

The repository includes a comprehensive automated quality suite:

```bash
# Type check and lint codebase
npm run lint

# Run automated Vitest test suite (18 unit tests)
npm test

# Run tests in interactive watch mode
npx vitest

# Compile production bundle
npm run build
```

See [TESTING_DELTA.md](./TESTING_DELTA.md) for test coverage matrices and testing guidelines.

---

## 🔄 Continuous Integration

Every pull request and push to `main` is validated via [GitHub Actions](./.github/workflows/ci.yml) across Node.js 20.x and 22.x LTS matrices:
- Codebase type safety (`tsc --noEmit`)
- Unit test execution (`vitest run`)
- Production bundle compilation (`vite build`)

---

## 🤝 Contributing

Contributions are welcome! Please review [CONTRIBUTING.md](./CONTRIBUTING.md) for our pull request process, commit conventions, and development standards.

---

## 🔒 Security

For vulnerability disclosures and security policies, please consult [SECURITY.md](./SECURITY.md).

---

## 📜 Changelog

All notable changes are tracked in [CHANGELOG.md](./CHANGELOG.md) following Keep a Changelog conventions.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
