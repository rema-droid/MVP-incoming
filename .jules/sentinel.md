## 2025-05-15 - Command Injection in Build Engine
**Vulnerability:** Command injection via unsanitized `githubUrl` and `repoId` in `build-engine/worker.ts`.
**Learning:** Using `child_process.exec` with template literals containing user-provided data is extremely dangerous and allows arbitrary shell command execution.
**Prevention:** Use `child_process.spawn` with an argument array instead of `exec` to bypass the shell. Always validate user inputs with strict regex patterns before using them in commands or file paths.
