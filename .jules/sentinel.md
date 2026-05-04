## 2025-05-14 - [CRITICAL] Command Injection in Build Engine

**Vulnerability:** Use of `child_process.exec` with unsanitized `githubUrl` and `repoId` in `build-engine/worker.ts` allowed for arbitrary command execution.

**Learning:** `exec` invokes a shell, making it vulnerable to shell metacharacters in user-provided strings. `git clone` is also susceptible to argument injection (e.g., passing flags as the URL).

**Prevention:**
1. Use `child_process.spawn` with `{ shell: false }` and pass arguments as an array to bypass shell parsing.
2. Use the `--` separator in `git clone` to terminate option parsing.
3. Validate all user-provided URLs against a strict regex (e.g., `/^https:\/\/[a-zA-Z0-9._\-\/@#+:]+$/`).
4. Sanitize identifiers used in file system paths or external CLI arguments to a strict alphanumeric set.
>>>>>>> REPLACE
