## 2025-05-14 - Command Injection in Build Worker
**Vulnerability:** The build engine used `child_process.exec` with unsanitized user-provided repository URLs and application names, allowing for remote command execution via shell metacharacters.
**Learning:** Even with basic validation at the API level, executing commands with `shell: true` (default for `exec`) is inherently risky when dealing with external data.
**Prevention:** Always use `child_process.spawn` with `shell: false` and pass arguments as an array to ensure they are never interpreted by a shell. Supplement this with strict regex-based input validation at the edge.
