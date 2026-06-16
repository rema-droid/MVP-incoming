## 2025-05-15 - Command Injection and Insecure Randomness Hardening
**Vulnerability:** Shell command injection via `exec` in `build-engine/worker.ts` and insecure token generation using `Math.random()` in `src/app/api/run/store.ts`.
**Learning:** `child_process.exec` is dangerous when handling user-provided strings (like repository URLs) as it interprets them in a shell. `Math.random()` is not cryptographically secure for generating sensitive tokens or passwords.
**Prevention:** Always use `child_process.spawn` with an arguments array to bypass the shell. Centralize security validation regexes (like `GITHUB_URL_REGEX`) and use `crypto.randomBytes` with rejection sampling for secure token generation.
