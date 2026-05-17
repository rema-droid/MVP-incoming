## 2025-05-15 - Command Injection in Build Worker
**Vulnerability:** The `build-engine/worker.ts` and `src/app/api/run/store.ts` were using `child_process.exec` (via a promisified wrapper) with unsanitized user-provided repository URLs and IDs. This allowed for command injection via shell metacharacters (e.g., `;`, `&`, `|`). Additionally, `git clone` was susceptible to argument injection (e.g., URLs starting with `-`).

**Learning:** Using `exec` or setting `shell: true` in `spawn` passes the entire command string to the system shell, which interprets special characters. Even with basic sanitization, shell escaping is notoriously difficult to get right across different environments.

**Prevention:** Always use `child_process.spawn` with `shell: false` (the default) and pass arguments as an array. This ensures the operating system treats the arguments as data rather than executable shell code. For `git` commands, use the `--` separator before the URL to explicitly mark the end of command options. Use strict regex-based validation for external inputs like URLs before they reach the execution layer.
