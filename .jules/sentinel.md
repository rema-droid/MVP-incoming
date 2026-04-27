## 2025-05-15 - Command Injection and Path Traversal in Build Engine
**Vulnerability:** Use of `child_process.exec` with unsanitized user input (`repoId`, `url`) in the build engine allowed for command injection and path traversal. Malicious repository URLs could also execute argument injection.
**Learning:** `exec` invokes a shell, making it dangerous when passing external input. Even with input validation, shell metacharacters can be complex to filter perfectly.
**Prevention:** Always use `child_process.spawn` with `shell: false` to pass arguments directly to the binary. Use the `--` separator for CLI tools like `git` to prevent argument injection. Sanitize all identifiers used in file system paths to a strict alphanumeric set.
