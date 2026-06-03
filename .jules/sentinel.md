## 2025-05-15 - Command Injection and SSRF prevention in Build Engine
**Vulnerability:** Command injection via unsanitized GitHub URLs passed to `child_process.exec` and potential SSRF.
**Learning:** Using `exec` with template strings is dangerous even if the input looks like a URL. Malicious users can append shell operators (e.g., `;`, `&`, `|`) to execute arbitrary commands.
**Prevention:** Always use `child_process.spawn` with an array of arguments to bypass the shell. Validate URLs at the API boundary using a strict allowlist of protocols and domains.

## 2025-05-15 - Weak secret generation
**Vulnerability:** Use of `Math.random()` for generating infrastructure passwords and tokens.
**Learning:** `Math.random()` is not cryptographically secure and can be predicted, potentially allowing attackers to guess service passwords.
**Prevention:** Use `crypto.randomBytes` or `crypto.randomUUID` for any security-sensitive tokens or passwords.
