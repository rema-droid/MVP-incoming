## 2025-05-14 - Prevent Command Injection in Build Engine

**Vulnerability:** The build engine used `child_process.exec` with string interpolation of user-controlled variables (repository URLs, application names). This allowed attackers to execute arbitrary shell commands by crafting malicious repository URLs.

**Learning:** Shell-based command execution (`exec`) is inherently dangerous when inputs are not perfectly sanitized. Even seemingly safe variables like repository IDs can be exploited if they are eventually used to construct a shell command.

**Prevention:** Always use `child_process.spawn` or `child_process.execFile` with an arguments array instead of a single command string. This bypasses shell interpretation entirely. For `git clone`, additionally use the `--` separator to signify the end of command options and prevent argument injection attacks from URLs starting with a hyphen.
