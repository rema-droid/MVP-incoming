## 2025-05-14 - Command Injection in Build Engine
**Vulnerability:** Use of `child_process.exec` with unsanitized user input (repository URL and ID) allowed for arbitrary command injection.
**Learning:** Shell-based execution (`exec`) parses the entire string, making it vulnerable to shell metacharacters.
**Prevention:** Use `child_process.spawn` or a helper that passes arguments as an array to bypass shell parsing. Always validate and sanitize user-controlled variables used in CLI arguments or filesystem paths.

## 2025-05-14 - Insecure Environment Variable Handling
**Vulnerability:** User-provided environment variable keys were not validated, potentially allowing injection into Docker command strings or shell environments.
**Learning:** Even if the executor is supposedly isolated (Docker), unsanitized keys can still be used to override critical system variables or inject flags.
**Prevention:** Always validate user-provided keys against a strict regex (e.g., `/^[a-zA-Z0-9_]+$/`).

## 2025-05-14 - Weak Randomness for Tokens
**Vulnerability:** `Math.random()` was used to generate security-sensitive tokens (e.g., database passwords).
**Learning:** `Math.random()` is PRNG and predictable, making it unsuitable for security purposes.
**Prevention:** Use `crypto.randomBytes` or `crypto.getRandomValues` for cryptographically secure random number generation.
