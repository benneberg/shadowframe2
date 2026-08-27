# Security Policy

## Supported Versions

The following versions of the Signage Lab Platform receive security updates:

| Version | Supported          |
| ------- | ------------------ |
| 3.x     | :white_check_mark: |
| < 3.0   | :x:                |

---

## Reporting a Vulnerability

We take the security of our platform and edge runtime simulator seriously. If you discover a security vulnerability, please follow responsible disclosure guidelines:

1. **Do not create a public issue.**
2. Send a detailed report via email to `security@signagelab.internal` or via GitHub Private Vulnerability Reporting.
3. Include:
   - Type of vulnerability (e.g., XSS in Shadow DOM template renderer, injection in virtual storage bridge, MQTT authentication flaw).
   - Step-by-step instructions or proof-of-concept demonstrating the issue.
   - Any suggested mitigations or patches.

We will acknowledge receipt within 48 hours and provide regular updates on remediation progress.

---

## Security Architecture & Best Practices

- **Sandboxed Template Overlays**: User-authored HTML/CSS overlays are rendered inside an isolated `ShadowRoot` on the engine container to prevent styles and scripts from escaping into the management console.
- **Environment Secrets**: Sensitive keys such as `GEMINI_API_KEY` are never committed to version control and must be loaded strictly via environment variables or server proxies.
- **Local Storage Isolation**: Simulated physical storage paths are prefixed (`webos_file_`) to prevent key collisions with CMS settings.
