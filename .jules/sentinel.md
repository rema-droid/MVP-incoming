## 2025-05-14 - [Command Injection in Build Engine]
**Vulnerability:** Use of `exec` with unsanitized user-provided repository URLs and IDs allowed for arbitrary command injection during the build and deployment process.
**Learning:** Even internal build engines must treat all metadata (like repo IDs or URLs) as untrusted, especially when these values are used to construct shell commands or directory names.
**Prevention:** Always use `child_process.spawn` with `shell: false` and pass arguments as an array. Sanitize all identifiers used in the filesystem or CLI arguments using strict allow-list regexes (e.g., `/[^a-zA-Z0-9-]/g`). Use the `--` separator for `git` commands to prevent positional argument injection.
