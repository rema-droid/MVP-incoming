## 2025-05-14 - [Command Injection in Docker Executor]
**Vulnerability:** Environment variable keys provided by users were interpolated directly into a `docker run` shell command without validation.
**Learning:** Even if the values are escaped, the keys themselves can be used for injection if they contain characters like `;` or `&`.
**Prevention:** Always validate both keys and values of environment variables against a strict allowlist (e.g., `/^[a-zA-Z_][a-zA-Z0-9_]*$/`) before passing them to a shell or a process executor.

## 2025-05-14 - [Proxy Credential Leakage]
**Vulnerability:** The runtime proxy was forwarding sensitive headers like `cookie` and `authorization` to untrusted third-party runtimes.
**Learning:** Proxies should operate on a "deny-by-default" or "strip-sensitive" basis when communicating with untrusted upstreams.
**Prevention:** Explicitly remove authentication and session-related headers (`cookie`, `authorization`, `set-cookie`) when proxying requests to untrusted environments.
