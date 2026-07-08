## 2025-05-14 - Prevent Command Injection in Build Engine
**Vulnerability:** Use of `child_process.exec` with unsanitized user-provided repository URLs allowed for potential shell command injection.
**Learning:** Even with basic validation, shell execution (shell: true) is risky when handling external strings. `spawn` with `shell: false` is a much stronger guarantee.
**Prevention:** Always use `spawn` with an argument array and `shell: false` for executing CLI tools with dynamic input. Add regex validation (e.g., `GITHUB_URL_REGEX`) at both the API and worker layers as defense-in-depth.
