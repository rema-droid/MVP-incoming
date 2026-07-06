## 2025-05-15 - [Critical Command Injection in Build Engine]
**Vulnerability:** The build engine used `child_process.exec` with string concatenation for GitHub URLs and repository IDs, allowing arbitrary shell command execution via malicious input.
**Learning:** Shell-based execution of user-provided strings is highly dangerous. Even with basic sanitization, shell metacharacters can bypass simple checks.
**Prevention:** Always use `child_process.spawn` with `shell: false` and an arguments array to ensure inputs are never interpreted as commands by the shell. Implement strict regex validation for all external inputs (URLs, IDs) before processing.
