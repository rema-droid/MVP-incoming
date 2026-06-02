## 2025-05-15 - Command Injection and Lack of Input Validation

**Vulnerability:** The build engine was using `child_process.exec` with unsanitized repository URLs, allowing for potential command injection. Additionally, there was no validation on the repository URL to ensure it was a legitimate GitHub URL.

**Learning:** Using `exec` with shell=true is dangerous when dealing with user-provided input, even if it's expected to be a URL. A malicious user could provide a URL like `https://github.com/owner/repo; rm -rf /` to execute arbitrary commands.

**Prevention:**
1. Use `child_process.spawn` with an arguments array instead of `exec` to avoid shell interpretation of the input.
2. Implement strict input validation for all user-provided data, especially when it's used in external process calls. In this case, enforcing HTTPS and a specific hostname (github.com) significantly reduces the attack surface.
3. Apply defense-in-depth by combining both input validation at the API layer and hardened execution in the worker layer.
