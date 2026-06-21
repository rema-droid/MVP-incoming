## 2025-05-14 - Secure Command Execution and Token Generation
**Vulnerability:** Command injection in `build-engine/worker.ts` via `exec` with unsanitized repo URLs and app names. Weak random token generation in `src/app/api/run/store.ts` using `Math.random()`.
**Learning:** Using `child_process.exec` to run shell commands with interpolated user input is highly susceptible to command injection. `Math.random()` is PRNG and not suitable for security-sensitive tokens.
**Prevention:** Always use `child_process.spawn` with `shell: false` and pass arguments as an array to ensure they are treated as data, not code. Use `crypto.randomBytes` for cryptographically secure random values.
