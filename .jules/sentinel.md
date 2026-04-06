## 2025-05-15 - Defense in Depth: Proxy Security and Injection Prevention
**Vulnerability:**
1. Proxy routes forwarded sensitive headers (`cookie`, `authorization`) to untrusted proxied runtimes and leaked `set-cookie` back to the client.
2. Insecure randomness (`Math.random()`) was used for service credentials.
3. Lack of protocol validation (`https://`) and command separator (`--`) in `git clone` created potential for MITM and argument injection.

**Learning:** When building a platform that runs and proxies third-party code, every layer of the proxy and build pipeline must be hardened. Standard `git clone` can be exploited with repo URLs starting with hyphens if `--` is not used.

**Prevention:**
- Strip all sensitive auth headers in proxy layers.
- Use `crypto.randomBytes` for any generated secret/token.
- Validate and enforce `https://` for external URLs.
- Always use `--` separator in CLI commands that take user input as arguments.
