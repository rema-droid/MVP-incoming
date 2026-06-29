## 2025-05-14 - Critical Command Injection in Build Worker
**Vulnerability:** The build engine worker used `child_process.exec` with unsanitized `githubUrl` and `repoId` inputs to execute shell commands like `git clone` and `flyctl deploy`. This allowed for arbitrary command injection (e.g., `; rm -rf /`).
**Learning:** Using template literals directly in `exec` strings is extremely dangerous when any part of the string comes from external input. Even seemingly safe IDs can be manipulated.
**Prevention:** Always use `child_process.spawn` with an array of arguments to bypass shell interpretation. Additionally, implement strict regex-based allowlists for all external inputs before they are used in any system-level operations.
