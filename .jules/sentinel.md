## 2025-05-15 - Command Injection and Path Traversal in Build Engine
**Vulnerability:** The build engine was using `child_process.exec` to run `git clone`, `flyctl`, and `rm` commands. User-provided `githubUrl` and `repoId` were interpolated directly into shell command strings, allowing for Command Injection and Path Traversal. Additionally, `git clone` was susceptible to argument injection.

**Learning:** Using `exec` with unsanitized user input in a background worker is a critical security risk. Even simple sanitization like `toLowerCase()` on an ID isn't enough if special characters or spaces are allowed. `git clone` specifically can be tricked into executing flags if the URL starts with a hyphen.

**Prevention:**
1. Always use `spawn` with `shell: false` to execute external binaries, passing arguments as an array.
2. Sanitize all identifiers used in file system paths or external CLI arguments using strict allow-lists (e.g., `/[^a-zA-Z0-9-]/g`).
3. Use the `--` separator for positional arguments in CLI tools like `git` to prevent argument injection.
4. Use native language APIs (like `fs/promises.rm`) instead of shell commands for file operations.
5. Implement defensive input validation at the API entry point (e.g., regex for URLs) as part of a defense-in-depth strategy.
