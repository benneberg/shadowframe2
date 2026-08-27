# Contributing to Signage Lab Platform

Thank you for your interest in contributing to Signage Lab Platform! This document outlines our development workflow, coding standards, and pull request guidelines.

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: v20.x or v22.x LTS
- **npm**: v10.x or higher

### Local Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/signage-lab-platform.git
   cd signage-lab-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The local preview will be available at `http://localhost:3000`.

---

## 🧪 Verification & Quality Checks

Before submitting any code changes, ensure that all automated checks pass locally:

```bash
# Type check and lint
npm run lint

# Run automated unit test suite
npm test

# Verify production build compilation
npm run build
```

---

## 📐 Architecture & Coding Guidelines

### 1. Separation of Concerns
- **Engine (`/engine`)**: Contains the edge runtime simulator (sequencer, storage bridges, shadow client, video switcher). The engine must remain decoupled from the React UI and operate purely as an event-driven headless system.
- **Console UI (`/components`)**: React presentation layer. Communicates with the engine exclusively through the `EventBus` and domain services.
- **Services (`/services`)**: Local persistence and configuration hydration.

### 2. TypeScript & Typing
- Maintain full type safety across all interfaces (`/types.ts` and `/engine/types/`).
- Avoid `any` where domain types exist.
- Ensure all public methods and event handlers have descriptive JSDoc comments.

### 3. Styling & Accessibility
- Use Tailwind CSS utility classes.
- Ensure high-contrast legibility for dark-mode telemetry and industrial dashboard interfaces.
- Use Lucide icons (`lucide-react`) for consistent iconography.

---

## 📝 Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature or capability
- `fix:` A bug fix
- `docs:` Documentation-only changes
- `refactor:` Code changes that neither fix a bug nor add a feature
- `test:` Adding or updating tests
- `chore:` Tooling, dependency, or configuration updates

Example: `feat(engine): add circular buffer rotation to hardware logger`

---

## 🔀 Pull Request Process

1. Create a feature branch: `git checkout -b feat/my-improvement`.
2. Commit your changes following commit conventions.
3. Ensure `npm run lint`, `npm test`, and `npm run build` all exit with code 0.
4. Push to your fork and submit a Pull Request targeting `main`.
5. Describe the problem solved and provide verification steps.
