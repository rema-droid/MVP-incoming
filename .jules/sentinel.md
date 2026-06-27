## 2025-05-14 - Command Injection via Shell Execution

**Vulnerability:** Use of `child_process.exec` with unsanitized user-provided repository URLs and IDs allowed for arbitrary command execution on the build worker.

**Learning:** String interpolation into shell commands is extremely dangerous. Even with "trusted" data, small oversights in validation can lead to full system compromise. The `build-engine/worker.ts` was particularly vulnerable because it directly used `githubUrl` and `repoId` (via `appName`) in `git clone` and `flyctl` commands.

**Prevention:** Always prefer `child_process.execFile` or `spawn` with an array of arguments over `exec`. This prevents the shell from interpreting special characters as command separators. Additionally, implement strict whitelist-based input validation (regex) for all data used in external process execution.
