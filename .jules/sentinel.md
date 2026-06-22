## 2025-05-15 - Hardened Input Validation and Secure Randomness
**Vulnerability:** Weak pseudo-random tokens using `Math.random()` and lack of validation for repository URLs and environment variable keys which could lead to command injection in `spawn` calls with `shell: true`.
**Learning:** Centralizing security utilities ensures consistent validation across API and storage layers. Using `crypto.randomBytes` with rejection sampling is necessary to prevent modulo bias in secure token generation.
**Prevention:** Always validate user-provided strings against strict regexes before using them in shell commands or file system operations. Prefer cryptographically secure random generators for any sensitive identifiers or passwords.
