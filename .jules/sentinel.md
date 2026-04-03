## 2025-05-22 - [Untrusted Runtime Proxy Leakage]
**Vulnerability:** Proxying requests to untrusted/ephemeral runtimes can leak sensitive session data (cookies, auth headers) from the main application domain to the untrusted environment.
**Learning:** Even when using an internal/isolated sandbox, if the proxy route is on the same domain or accessible via a path that includes main app cookies, those cookies are forwarded by default if not explicitly stripped. Similarly, the untrusted environment could set cookies on the main domain via `Set-Cookie`.
**Prevention:** Always strip `Cookie` and `Authorization` headers from incoming requests to untrusted upstreams, and strip `Set-Cookie` from their responses.
