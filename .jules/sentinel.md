## 2025-05-22 - Command Injection via Shell Execution

**Vulnerability:** Command injection in `build-engine/worker.ts` via unsanitized `githubUrl` and `repoId` passed to `exec`.

**Learning:** Using `child_process.exec` with string interpolation for user-provided data is extremely dangerous as it spawns a shell that can interpret meta-characters.

**Prevention:** Always prefer `child_process.spawn` or `child_process.execFile` with arguments passed as an array to bypass shell interpretation. Additionally, strictly validate and sanitize all external inputs using allow-list regex patterns before use in CLI commands or filesystem operations.
