## 2025-08-01 - Command Injection via Background Worker Shell Command Execution
**Vulnerability:** The background build engine `worker.ts` executed git clone and flyctl commands using `child_process.exec` (which executes commands inside a shell). The `githubUrl` and `repoId` parameters were directly interpolated into these shell command strings without validation or sanitization, introducing a critical command injection vulnerability.
**Learning:** The background worker assumed that input validation performed at the REST API/Route level was sufficient, or omitted validation for parameters like repository URLs. However, relying solely on single-layer validation at the entry points violates defense-in-depth, and using shell-parsing execution functions like `exec` poses severe security risks.
**Prevention:**
1. Avoid shell execution entirely by utilizing `child_process.spawn` with `shell: false` (or a custom safe wrapper like `safeExec`) which passes arguments as a safe array instead of a parsed string.
2. Implement multiple layers of validation (Defense in Depth) by validating parameters at both the API entry point and inside background worker queues.
3. Construct absolute temporary directories using robust Node APIs like `path.join(process.cwd(), ...)` with sanitized alphanumeric components to prevent directory traversal.
