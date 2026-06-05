## 2025-05-15 - Command Injection in Build Engine
**Vulnerability:** Remote Command Injection via malicious repository URLs and IDs in `build-engine/worker.ts`.
**Learning:** Using `child_process.exec` (or `execAsync` wrapper) executes commands in a shell, allowing attackers to use shell metacharacters (like `;`, `&`, `|`) in inputs (repo URL, repo ID) to execute arbitrary commands.
**Prevention:** Always use `child_process.spawn` with an arguments array to bypass the shell interpolation. Implement strict regex-based validation for all user-controlled inputs used in CLI commands (e.g., GitHub URL regex).
