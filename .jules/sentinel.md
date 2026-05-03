## 2025-05-22 - [Command and Argument Injection in Build Engine]
**Vulnerability:** Use of `child_process.exec` with untrusted repository URLs and IDs allowed for command injection. Lack of `--` separator in `git clone` allowed for argument injection.
**Learning:** Shell execution should always be avoided in favor of direct process spawning with `shell: false`. Input sanitization must distinguish between application-level identifiers (for Redis/DB) and OS-level identifiers (for file paths/app names).
**Prevention:** Use a safe `run` helper with `spawn` and `shell: false`. Always use the `--` separator before positional arguments in CLI tools. Sanitize all inputs used in file paths or shell commands.
