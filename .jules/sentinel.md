## 2025-05-14 - Command Injection via Unvalidated Job Data
**Vulnerability:** Command injection in `build-engine/worker.ts` via string interpolation of `githubUrl` and `repoId` into `child_process.exec`.
**Learning:** Using `exec` with user-provided strings is inherently dangerous as it executes commands via a shell. Even simple inputs like repository IDs can be manipulated if not strictly validated.
**Prevention:** Always use `child_process.spawn` or `execFile` with an array of arguments to bypass the shell. Additionally, implement strict regex validation for all inputs that will be used in system-level operations.
