## 2025-05-14 - Command Injection via Shell Execution in Background Worker
**Vulnerability:** The build engine used `exec` with string concatenation for `git clone` and `flyctl` commands, allowing for command injection via malicious repository URLs or IDs.
**Learning:** Background workers that execute shell commands are highly sensitive to unsanitized inputs. Even internal IDs can be dangerous if they can be influenced by users and are used in shell strings.
**Prevention:** Always use `spawn` with argument arrays instead of shell-based `exec`. Centralize and enforce strict regex validation for all inputs that touch the operating system or external CLIs.

## 2025-05-14 - Biased and Predictable Random Token Generation
**Vulnerability:** The application used `Math.random()` and simple modulo operations for generating security tokens (e.g., database passwords), leading to predictability and statistical bias.
**Learning:** `Math.random()` is not cryptographically secure. Simple modulo operations on random bytes introduce bias if the range is not a power of 2.
**Prevention:** Use `crypto.randomBytes` and implement rejection sampling to ensure unbiased, cryptographically secure random tokens.
