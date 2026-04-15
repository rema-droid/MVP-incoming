## 2025-05-14 - Secured Proxy and Build Engine

**Vulnerability:**
1. The proxy routes were passing sensitive headers (cookies, auth) from the client to the potentially untrusted proxied application.
2. The build engine was using `exec` which is vulnerable to command injection.
3. `git clone` was vulnerable to argument injection via malicious repository URLs.
4. Repository URLs were not validated, potentially allowing non-HTTPS protocols.

**Learning:**
Proxies should always operate on a principle of least privilege regarding headers. Build engines that interact with user-provided URLs must use secure execution methods and strictly validate inputs to prevent various forms of injection.

**Prevention:**
- Strip all non-essential sensitive headers in proxies.
- Use `spawn` with an arguments array instead of `exec` with a string.
- Use the `--` separator for CLI commands that take URLs/paths.
- Enforce `https://` for all external repository URLs.
