# Signage Lab Platform v3

> **High-Fidelity Edge Runtime Simulator & CMS Orchestrator for B2B Digital Signage.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-benneberg.github.io%2Fshadowframe2-00ffc6?style=for-the-badge&logo=google-chrome&logoColor=black)](https://benneberg.github.io/shadowframe2/)
[![CI Pipeline](https://github.com/benneberg/shadowframe2/actions/workflows/ci.yml/badge.svg)](https://github.com/benneberg/shadowframe2/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Tested-729B1B.svg?logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E%20Tested-45ba4b.svg?logo=playwright)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

🌐 **Public Live Demo:** [https://benneberg.github.io/shadowframe2/](https://benneberg.github.io/shadowframe2/) *(Instant one-click interactive preview hosted on GitHub Pages)*

Signage Lab Platform provides a high-fidelity virtualized environment for designing, testing, and debugging enterprise Digital Signage applications. It simulates the hardware constraints, storage systems, and kernel behaviors of commercial signage displays (LG webOS and Samsung Tizen), enabling rapid iteration and remote diagnostics without physical hardware.

---

## Key Capabilities

- **Zero-Gap Dual Video Engine**: Slot-based (A/B) decoding pipeline eliminating black frames and transition latency on commercial displays.
- **Layered Compositor**: Template overlays rendered inside an isolated `ShadowRoot` over hardware-accelerated video surfaces.
- **Offline-First Storage**: IndexedDB binary Blob storage cache with predictive preloading for resilient offline playback.
- **Hardware Storage Bridge**: Virtualized internal and USB storage tiers with asynchronous write buffering and a 500-line circular rotation ceiling.
- **Visual Template Layout Previews**: Interactive SVG and CSS wireframe preview component for multi-zone signage layouts (Fullscreen HUD, Split 70/30, L-Bar).
- **Setup QR Provisioning**: Instant QR code generation emitting standardized node identity JSON payloads for fleet onboarding.
- **Real-Time Network Diagnostics**: Ping testing tool simulating edge node network round-trip latency.
- **Device Shadow Reconciliation**: AWS IoT-style MQTT device shadow client synchronizing desired vs. reported player configurations.

---

## Architecture Summary

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

## Quick Start

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

## Environment Configuration

Environment variables are documented in [`.env.example`](./.env.example):

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional | API key for AI-assisted signage templates and content generation | *None* |
| `VITE_APP_ENV` | Optional | Deployment environment (`development`, `production`, `test`) | `development` |

---

## Quality Tooling & Automated Verification

The repository includes a comprehensive automated quality and verification suite:

```bash
# Type check and lint codebase
npm run lint

# Run automated Vitest unit & integration test suite (22 tests)
npm test

# Run Playwright End-to-End smoke tests (5 browser automation tests)
npm run test:e2e

# Run unit tests in interactive watch mode
npx vitest

# Compile production bundle with Rollup manualChunks code splitting
npm run build
```

See [TESTING_DELTA.md](./TESTING_DELTA.md) for test coverage matrices and testing guidelines.

---

## Continuous Integration & CD Deployment

Every pull request and push to `main` is validated and automatically deployed via [GitHub Actions](./.github/workflows/ci.yml) on Node.js 22 LTS:
1. **Type Safety Verification**: Strict TypeScript type checking (`tsc --noEmit`).
2. **Unit & Integration Testing**: Vitest suite covering edge storage bridges, hardware logging, and zero-gap player sequencer.
3. **End-to-End Testing**: Playwright headless browser smoke tests validating virtual viewport rendering, Shadow DOM template overlays, and layout sandbox toggling.
4. **Optimized Production Build**: Vite/Rollup production build with granular chunk splitting (`vendor-react`, `vendor-motion`, `vendor-dnd`, `vendor-icons`, `vendor-utils`).
5. **Automated GitHub Pages Deployment**: Seamless zero-config deployment to [https://benneberg.github.io/shadowframe2/](https://benneberg.github.io/shadowframe2/) using official `actions/deploy-pages`.

---

## Contributing

Contributions are welcome! Please review [CONTRIBUTING.md](./CONTRIBUTING.md) for our pull request process, commit conventions, and development standards.

---

## Security

For vulnerability disclosures and security policies, please consult [SECURITY.md](./SECURITY.md).

---

## Changelog

All notable changes are tracked in [CHANGELOG.md](./CHANGELOG.md) following Keep a Changelog conventions.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
