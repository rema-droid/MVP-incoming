## 2026-04-24 - Command Injection in Build Engine
**Vulnerability:** Use of `child_process.exec` with unsanitized user input allowed for shell command injection via malicious repository URLs.
**Learning:** Shell-based execution of external commands is a high-risk pattern. Even with basic sanitization, shell metacharacters can often be used to escape the intended command.
**Prevention:** Always use `spawn` with `shell: false` to execute external binaries. Use the `--` separator for CLI tools to ensure positional arguments are not interpreted as flags. Validate and sanitize all inputs that reach the filesystem or shell.
