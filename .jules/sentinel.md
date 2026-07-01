## 2025-05-15 - Command Injection Mitigation in Build Engine
**Vulnerability:** The `build-engine/worker.ts` was using `child_process.exec` with unsanitized user-provided repository URLs and derived application names, leading to a command injection risk.
**Learning:** Even internal workers processing queue jobs are vulnerable if they don't strictly validate inputs or if they use shell-based command execution for external binaries like `git` and `flyctl`.
**Prevention:** Always use `child_process.spawn` with an array of arguments to bypass the shell, and implement strict regex-based validation for any user-provided strings used in command parameters or file paths.
