## 2025-05-14 - Command Injection via Shell Execution

**Vulnerability:** Use of `child_process.exec` with unsanitized user-controlled inputs (`githubUrl`, `repoId`) allowed for arbitrary command execution on the build worker.
**Learning:** Shell-based execution (`exec`) parses the command string through `/bin/sh`, which interprets metacharacters like `;`, `&`, `|`, and backticks. Even with seemingly "safe" prefixes, a malicious URL could inject secondary commands.
**Prevention:** Always use `child_process.spawn` with an argument array instead of `exec` to bypass shell parsing. Additionally, implement strict regex-based allowlisting for all external inputs before they reach any system-level API.
