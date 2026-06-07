## 2025-05-15 - Command Injection in Build Worker
**Vulnerability:** User-provided repository URLs were passed directly to `child_process.exec` in the build engine worker, allowing arbitrary shell command execution via crafted URLs.
**Learning:** Using shell-based execution (`exec`) with unsanitized external input is a high-risk pattern. Even if the input appears to be a URL, shell metacharacters can be used to break out of the intended command.
**Prevention:** Always use `child_process.spawn` (or a safe wrapper) without shell interpretation for executing external binaries with user-controlled arguments. Implement strict regex validation for all external inputs (Defense in Depth).

## 2025-05-15 - Insecure Randomness for Security Tokens
**Vulnerability:** The application used `Math.random()` to generate database passwords and security tokens.
**Learning:** `Math.random()` in JavaScript is PRNG (Pseudo-Random Number Generator) and is not cryptographically secure, making generated secrets predictable.
**Prevention:** Use `crypto.randomBytes` or `crypto.randomUUID` for generating any sensitive tokens, passwords, or identifiers.
