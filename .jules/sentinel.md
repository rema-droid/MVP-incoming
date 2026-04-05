## 2025-05-15 - [Proxy Header Leakage & Argument Injection]
**Vulnerability:** Proxy routes were forwarding sensitive authentication headers (`cookie`, `authorization`) to untrusted runtimes and allowing `set-cookie` from them. Additionally, `git clone` was vulnerable to argument injection via malicious repository URLs.
**Learning:** In multi-tenant or "cloud run" environments where untrusted code is executed, strict isolation of credentials and sanitization of shell-like commands (using `--` separator) are essential.
**Prevention:** Always strip credentials in proxy logic and use the `--` separator for CLI commands that take user-provided URLs or paths.
