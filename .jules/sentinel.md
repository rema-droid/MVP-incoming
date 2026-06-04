# Sentinel Security Journal

## 2025-05-14 - Fix Command Injection and Insecure Secret Generation
**Vulnerability:** Unsanitized user input (`githubUrl` and `repoId`) was passed directly to `child_process.exec`, allowing for remote command injection. Additionally, `Math.random()` was used for generating sensitive secrets.
**Learning:** Using `exec` with string templates is dangerous when handling user-provided data. `Math.random()` is PRNG and not suitable for security purposes.
**Prevention:** Use `child_process.spawn` with argument arrays to avoid shell interpretation. Use `crypto.randomBytes` for cryptographically secure random values.
