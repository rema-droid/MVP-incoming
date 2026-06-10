## 2025-05-15 - Command Injection via Unsanitized Shell Inputs
**Vulnerability:** Command injection in the background worker and local execution store via unsanitized repository URLs and environment variable keys.
**Learning:** Shell-templated strings in `exec` or `spawn` with `shell: true` are extremely dangerous when they include any user-controlled input. Even seemingly harmless fields like `repoId` can be vectors for path traversal or command injection if they are not strictly sanitized.
**Prevention:** Always use strict regex validation for any user input that will be used in a shell command. Prefer using non-shell execution where possible. Centralize security constants like `GITHUB_URL_REGEX` in a shared utility to ensure consistent enforcement across the codebase.
