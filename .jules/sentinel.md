## 2025-05-14 - Hardening Repository Operations and Proxies

**Vulnerability:** Multiple injection points and potential credential leakage.
- Command injection in `build-engine/worker.ts` due to `exec` with unsanitized repository URLs.
- Argument injection in `git clone` across the project from URLs starting with hyphens.
- Protocol-based attacks (e.g., `file://`) via unvalidated repository URLs.
- Potential credential leakage in proxy routes by forwarding user cookies/auth to untrusted runtimes.

**Learning:**
- `exec` should be avoided when handling external input; `spawn` with an arguments array is significantly safer.
- The `--` separator is critical in CLI commands (especially `git`) to distinguish between flags and positional arguments like URLs.
- Proxying to untrusted or user-controlled runtimes requires strict header sanitation (stripping `cookie`, `authorization`, and `set-cookie`).

**Prevention:**
- Implement strict protocol validation (`https://`) for all external URLs.
- Default to `spawn` for command execution.
- Maintain a list of sensitive headers that must be stripped in all proxy logic.
