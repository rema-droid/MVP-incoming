## 2025-05-14 - [Command Injection via Repo ID]
**Vulnerability:** User-controlled `repoId` was used directly in shell commands and filesystem paths in `build-engine/worker.ts`.
**Learning:** Even internal IDs can be dangerous if they are not strictly validated or sanitized when passed to shell executors like `exec`.
**Prevention:** Always sanitize any user-controlled variable used in shell commands with a strict allowlist (e.g., `replace(/[^a-zA-Z0-9-]/g, '_')`).
