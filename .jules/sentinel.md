## 2025-05-15 - Hardening Repository Ingestion and Proxy
**Vulnerability:** Command and argument injection in build engine; credential leakage in proxy.
**Learning:** Using `exec` with shell enabled is dangerous when input is not fully sanitized. `git clone` is susceptible to argument injection via URLs starting with `-` unless `--` is used.
**Prevention:** Always use `spawn` (no shell) for command execution. Use `--` to separate flags from positional arguments in CLI tools. Explicitly strip sensitive headers (Cookie, Authorization) in proxy routes.
