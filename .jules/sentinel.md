## 2025-05-14 - Harden command execution and input validation
**Vulnerability:** Command Injection in the build-engine worker via unsanitized GitHub URLs and app names passed to shell-based `exec`.
**Learning:** Distributed systems often trust data coming from internal queues (BullMQ/Redis), but this data can originate from user-facing APIs. Relying on shell-based `exec` for system commands like `git clone` or `flyctl` is inherently risky when dealing with dynamic inputs.
**Prevention:** Always use `spawn` with arguments passed as an array to bypass shell parsing. Centralize strict regex validation (e.g., `GITHUB_URL_REGEX`) and apply it at both the API entry point and the worker execution level for defense in depth.
