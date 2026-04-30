## 2026-04-30 - [Command and Argument Injection in Build Engine]
**Vulnerability:** Unsanitized user inputs (repository URL and ID) were passed directly to shell commands via `exec`, and `git clone` lacked the `–-` separator.
**Learning:** Using `shell: true` or `exec` with user-controlled strings allows for command injection. IDs that are used in file system paths or app names must be strictly sanitized. `git clone` is vulnerable to argument injection if the URL starts with a hyphen.
**Prevention:** Always use `spawn` with `shell: false`, sanitize all identifiers used in commands/paths with strict regex (e.g., `/[^a-zA-Z0-9-]/g`), and use the `–-` separator for positional arguments in CLI tools.
