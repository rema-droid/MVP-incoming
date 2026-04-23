## 2025-05-14 - Build Engine Command Injection and Argument Injection
**Vulnerability:** Use of `child_process.exec` with unsanitized repository URLs and IDs allowed for command injection. Malicious URLs starting with hyphens could also trigger argument injection in `git clone`.
**Learning:** Even with "safe-looking" wrappers, shell execution (`exec`) is dangerous for build engines. `spawn` with `shell: false` is the only safe way to execute external binaries with user-provided arguments.
**Prevention:** Always use `spawn` with `shell: false`, use the `--` separator for CLI positional arguments, and strictly sanitize any input used in file system paths.
