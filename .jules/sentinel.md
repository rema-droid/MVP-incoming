## 2025-05-15 - Command Injection in Build Worker
**Vulnerability:** User-provided repository URLs were interpolated directly into shell commands via `exec` in `build-engine/worker.ts`, allowing for arbitrary command execution.
**Learning:** Shell-based execution (`exec`) is inherently dangerous when dealing with external inputs. Even if the inputs seem "safe" (like IDs), they should be validated and passed as separate arguments to `spawn`.
**Prevention:** Use `spawn` with an array of arguments instead of `exec` with a shell string. Implement strict regex validation for all external inputs (URLs, IDs, environment variable keys).
