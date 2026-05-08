## 2025-05-14 - Critical Command Injection in Build Engine
**Vulnerability:** Command injection in `build-engine/worker.ts` via unsanitized `githubUrl` and `repoId` passed to `exec`.
**Learning:** Using `exec` or `spawn` with `shell: true` allows shell metacharacters in user-provided strings (like URLs or IDs) to execute arbitrary commands. Even repository URLs can be malicious (e.g., `https://github.com/repo; rm -rf /`).
**Prevention:** Always use `spawn` with `shell: false` and pass arguments as an array. Additionally, validate all inputs against strict regex (e.g., `isValidRepoUrl`) and sanitize IDs (e.g., `sanitizeId`) before using them in file paths or CLI arguments. Use the `--` separator in `git clone` to prevent flag injection.
