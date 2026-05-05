## 2025-05-05 - [CRITICAL] Command Injection via `child_process.exec` and Argument Injection in `git clone`
**Vulnerability:** Use of `child_process.exec` with template literals containing user-provided repository URLs allowed for arbitrary shell command execution. Additionally, `git clone` calls without the `--` separator were vulnerable to argument injection where a malicious URL (e.g., one starting with `-`) could be interpreted as a git flag.

**Learning:** `exec` invokes a shell (`/bin/sh`), making it extremely dangerous for any input that isn't perfectly sanitized. Even with `spawn`, omitting the `--` separator in commands like `git clone` leaves a vector for argument injection.

**Prevention:**
1. Always use `child_process.spawn` with `shell: false` and pass arguments as an array.
2. Use the `--` separator before positional arguments (like URLs) in CLI tools to signify the end of flags.
3. Implement strict regex validation for all external inputs (e.g., `githubUrl`) at the API boundary and again at the execution boundary.
4. Sanitize identifiers used in file paths or app names to a strict alphanumeric set.
