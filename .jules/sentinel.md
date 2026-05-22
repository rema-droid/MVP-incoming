## 2026-05-22 - Command Injection in Build Engine Worker
**Vulnerability:** The `build-engine/worker.ts` used `child_process.exec` with template literals to execute shell commands like `git clone` and `flyctl deploy`. This was vulnerable to command injection if malicious repository URLs or IDs were provided.
**Learning:** Background workers that interface with CLI tools are high-risk areas for command injection. Using `exec` with string interpolation is a common anti-pattern that bypasses shell escaping.
**Prevention:** Always use `child_process.spawn` with an arguments array instead of `exec` for external commands. Implement strict input validation (regex for URLs, alphanumeric for IDs) at both the API entry point and the worker itself.
