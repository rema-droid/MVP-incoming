## 2025-05-23 - Secure Token Generation with Rejection Sampling
**Vulnerability:** Predictable token generation using `Math.random()`.
**Learning:** `Math.random()` is not cryptographically secure and can lead to predictable secrets (passwords, session IDs). Simply using `crypto.randomBytes(n) % length` introduces modulo bias, making some characters appear more frequently than others.
**Prevention:** Use `crypto.randomBytes` with rejection sampling to ensure a perfectly uniform distribution across the desired character set. Centralize these utilities to ensure consistent security across the app and its microservices.
