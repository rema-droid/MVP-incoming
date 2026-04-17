## 2025-05-15 - [Secure Proxy Header Stripping]
**Vulnerability:** Reverse proxy routes to untrusted sandboxes were forwarding sensitive client credentials and allowing the sandbox to set cookies on the host domain.
**Learning:** Proxy logic should always default to a "deny-list" or "allow-list" for sensitive headers when interacting with untrusted or multi-tenant environments to prevent credential leakage and session hijacking.
**Prevention:** Centralize proxy logic into a shared utility that enforces security standards like stripping `cookie`, `authorization`, and `set-cookie` headers.
