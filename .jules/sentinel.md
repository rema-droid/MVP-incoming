## 2025-05-14 - Command Injection and Argument Injection Prevention
**Vulnerability:** Shell command injection via `child_process.exec` and argument injection via `git clone`.
**Learning:** Using `shell: true` or `exec` with user-controlled strings is extremely dangerous as it allows arbitrary command execution via shell operators. Even with `spawn` and `shell: false`, some binaries like `git` can be tricked by arguments that look like flags (e.g., `-u`).
**Prevention:** Always use `child_process.spawn` with `shell: false` to pass arguments as a list. Use the `--` separator to explicitly end option processing before positional arguments like URLs. Strictly validate and sanitize all user-provided strings before using them in shell-adjacent logic or file paths.
