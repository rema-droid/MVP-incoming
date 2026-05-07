## 2025-05-23 - Command Injection in Build Engine
**Vulnerability:** The `build-engine/worker.ts` was using `child_process.exec` with string interpolation of user-provided repository URLs and IDs. This allowed for arbitrary command execution on the worker instance.
**Learning:** Using `exec` with `shell: true` (default) and string interpolation is highly dangerous for any input that isn't strictly validated. Even "internal" IDs like `repoId` should be sanitized if they originated from user input.
**Prevention:** Use `child_process.spawn` with `shell: false` and pass arguments as an array. Always use the `--` separator for CLI tools that support it (like `git clone`) to prevent the URL from being interpreted as an argument. Sanitize all variables used in shell-like contexts.
