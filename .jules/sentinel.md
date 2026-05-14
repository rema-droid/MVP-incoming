## 2025-05-15 - Command and Argument Injection Prevention
**Vulnerability:** Shell-based execution using `exec` and unsanitized user inputs (URLs and IDs) allowed for potential command and argument injection.
**Learning:** Using `child_process.exec` is dangerous when passing user-provided strings. Even without shell meta-characters, `git clone` can be vulnerable to argument injection (e.g., `--upload-pack`).
**Prevention:** Always use `child_process.spawn` with `shell: false` to avoid shell injection. Use the `--` separator in CLI commands like `git clone` to treat subsequent strings as positional arguments rather than options. Sanitize all identifiers used in resource names (like Docker containers) to a strict alphanumeric set.
