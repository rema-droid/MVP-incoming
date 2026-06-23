## 2025-05-14 - Input Validation and Secure Randomness

**Vulnerability:** Unsanitized user inputs (GitHub URLs, environment variable keys) were being passed to shell commands (`git clone`, `docker run -e`), creating a risk of command injection. Additionally, `Math.random()` was used for security tokens.

**Learning:** Microservices or standalone workers (like `build-engine`) often lack the validation logic present in the main API layer. Command strings constructed via template literals are particularly vulnerable if they include user-provided strings without strict allowlisting.

**Prevention:**
1. Use strict Regex validation (`GITHUB_URL_REGEX`, `ENV_KEY_REGEX`) at the first point of entry and again before shell execution (defense-in-depth).
2. Centralize security utilities but allow local copies in isolated workers to avoid complex dependency path issues.
3. Always use `crypto.randomBytes` with rejection sampling for alphanumeric tokens to ensure cryptographic strength and uniform distribution.
