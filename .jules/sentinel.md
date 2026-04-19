## 2025-05-14 - Harden Shell Command Execution in Build Engine
**Vulnerability:** Command injection in `build-engine/worker.ts` via unsanitized `githubUrl` and `repoId` passed to `child_process.exec`.
**Learning:** Using `exec` with string interpolation of user-provided data is extremely dangerous as it allows shell escape sequences. Even "cloning" a repo can be a vector for argument injection if the URL starts with a hyphen.
**Prevention:** Always use `spawn` or `execFile` with an arguments array to avoid shell interpretation. Use the `--` separator for `git clone` to force the URL to be treated as a positional argument. Sanitize any user-provided strings used in file paths or resource names.
