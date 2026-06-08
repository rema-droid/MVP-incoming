## 2026-06-08 - Command Injection via Shell Execution
**Vulnerability:** Command injection was possible in `build-engine/worker.ts` because `execAsync` (using `child_process.exec`) was called with unsanitized `githubUrl` and `repoId`.
**Learning:** Using shell-based execution (`exec`) with user-controlled input is extremely dangerous as it allows shell metacharacters (like `;`, `&`, `|`) to execute arbitrary commands.
**Prevention:** Always prefer `child_process.spawn` with an arguments array, which avoids the shell entirely. Additionally, implement strict regex validation for all external inputs and sanitize internal identifiers to prevent path traversal or log injection.
