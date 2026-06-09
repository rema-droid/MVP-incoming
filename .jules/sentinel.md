## 2025-06-09 - Hardening repository processing and randomness

**Vulnerability:** Command injection in build worker and insecure token generation.

**Learning:** Shell commands constructed using user-provided repository IDs and URLs were not sufficiently sanitized, creating a risk of command injection. Additionally, `Math.random()` was used for security tokens (secrets/passwords), which is not cryptographically secure.

**Prevention:** Always use strict regex validation for user-provided strings before including them in shell commands or filesystem paths. Use `crypto.randomBytes` for any security-sensitive random values.
