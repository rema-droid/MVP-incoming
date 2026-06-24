## 2025-05-14 - Command Injection in Background Worker
**Vulnerability:** The `build-engine/worker.ts` used `exec()` with a template string containing unvalidated user-provided GitHub URLs, allowing command injection (e.g., `https://github.com/user/repo; touch /tmp/pwned`).
**Learning:** Even if the frontend/API validates input, background workers should implement their own validation and use safe process execution methods (like `execFile`) to provide defense-in-depth.
**Prevention:** Use `child_process.execFile` with an array of arguments and the `--` separator to prevent both shell injection and option injection. Always validate inputs against strict regex patterns (e.g., `GITHUB_URL_REGEX`) at every architectural boundary.
