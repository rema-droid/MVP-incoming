## 2025-05-14 - Prevent Command Injection in Build Engine
**Vulnerability:** Use of `child_process.exec` with unsanitized user inputs (`githubUrl`, `repoId`) allowed arbitrary shell command execution in the background worker.
**Learning:** Concatenating user-controlled strings directly into shell commands via `exec` is a critical risk as it invokes a shell that interprets special characters (e.g., `;`, `&&`, `|`).
**Prevention:** Always use `child_process.spawn` with an explicit arguments array instead of `exec`. Additionally, use the `--` separator for CLI tools like `git clone` to prevent malicious URLs from being interpreted as command-line flags (argument injection).
