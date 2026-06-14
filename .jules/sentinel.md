## 2025-05-15 - Command Injection and Insecure Randomness

**Vulnerability:**
1. Potential Command Injection in `build-engine/worker.ts` via unsanitized GitHub URLs and repository IDs passed to shell commands (`exec`).
2. Use of cryptographically insecure `Math.random()` for generating service passwords and tokens in `src/app/api/run/store.ts`.

**Learning:**
1. Using `child_process.exec` (or its promisified version) implicitly uses a shell, making the application vulnerable to command injection if any part of the command string is user-controlled.
2. Standard `Math.random()` is not suitable for generating secrets. Even when using secure alternatives like `crypto.randomBytes()`, developers must be careful about "modulo bias" when mapping raw bytes to a character set.

**Prevention:**
1. Prefer `child_process.spawn` with argument arrays over `exec` to avoid shell interpretation.
2. Validate and sanitize all external inputs using strict regex patterns before using them in filesystem paths or system commands.
3. Use `crypto.randomBytes()` for all security-sensitive random data and implement unbiased sampling (e.g., rejection sampling) when converting bytes to specific ranges or character sets.
