## 2025-05-14 - Command Injection in Background Worker
**Vulnerability:** Command injection and path traversal via unsanitized `githubUrl` and `repoId` in the `build-engine/worker.ts` background process.
**Learning:** Background workers often bypass the usual API-level validations. In this case, `exec` with string interpolation was used to run `git clone` and `flyctl` commands, allowing arbitrary shell command execution if an attacker could control the repository metadata.
**Prevention:**
1. Always sanitize inputs used in shell commands or filesystem paths using strict regex (e.g., `/[^a-zA-Z0-9-]/g`).
2. Prefer `spawn` or `execFile` with an arguments array over `exec` with shell interpolation to prevent shell injection.
3. Use built-in Node.js module functions (like `fs.rm`) instead of spawning shell commands (like `rm -rf`) for filesystem operations.
