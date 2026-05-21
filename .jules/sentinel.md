## 2025-05-15 - Command Injection and Path Traversal Prevention in Run Cloud

**Vulnerability:** User-provided repository URLs and IDs were used directly in shell commands (`git clone`) and file system paths without validation or sanitization, leading to potential command injection and path traversal.

**Learning:** When building systems that execute shell commands or interact with the file system based on user input, validation must happen at the entry point (API) and sanitization must be applied at the point of use (Worker/Executor).

**Prevention:** Use `isValidRepoUrl` to restrict URLs to safe formats (HTTPS) and `sanitizeRepoId` to restrict IDs to safe character sets (alphanumeric, hyphens). Centralize these utilities where possible, but re-implement or sync them if the environment (like a separate worker package) lacks access to shared libraries.
