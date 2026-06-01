## 2025-05-15 - Command Injection via unsanitized repository URLs
**Vulnerability:** The build engine used `child_process.exec` to run `git clone` and `flyctl` commands with unsanitized repository URLs and app names.
**Learning:** Using `exec` with string concatenation for commands involving user input is highly dangerous as it spawns a shell that can interpret malicious characters.
**Prevention:** Always use `child_process.spawn` with `shell: false` and pass arguments as an array to prevent shell injection. Additionally, validate inputs like URLs early in the request lifecycle.
