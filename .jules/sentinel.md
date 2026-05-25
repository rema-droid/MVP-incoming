## 2026-05-25 - Command Injection in Build Engine and API
**Vulnerability:** Command Injection via unsanitized repository URLs and IDs in shell commands.
**Learning:** The application was using `child_process.exec` with template strings for `git clone`, `flyctl`, and `docker` commands, allowing an attacker to execute arbitrary code by providing a malicious repository URL or ID.
**Prevention:** Always prefer `child_process.spawn` with an arguments array over `exec` with string concatenation. Implement strict input validation (e.g., regex whitelisting for URLs) as the first layer of defense.
