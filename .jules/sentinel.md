## 2025-05-22 - Secure Randomness and Input Validation
**Vulnerability:** Insecure random token generation using `Math.random()` and lack of validation for repository URLs and environment variable keys.
**Learning:** Using `Math.random()` for passwords or tokens is a high-risk pattern as it is PRNG-based and predictable. Additionally, passing unsanitized user input (like repo URLs or env keys) into shell-executed commands (git, docker) creates a critical injection surface.
**Prevention:** Always use `crypto.randomBytes` for security-sensitive tokens, ideally with rejection sampling to avoid modulo bias. Centralize validation patterns (like `GITHUB_URL_REGEX` and `ENV_KEY_REGEX`) in a shared security library to ensure defense-in-depth across all API layers.
