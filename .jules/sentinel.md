## 2025-05-14 - [Proxy Credential Leakage & Argument Injection]
**Vulnerability:** Proxy routes in `src/app/api/run` leaked sensitive headers (`cookie`, `authorization`, `set-cookie`) between the host and untrusted runtimes. `git clone` was vulnerable to argument injection via repository URLs starting with hyphens.
**Learning:** Catch-all routes (`[...path]`) and base routes must both implement the same header stripping logic for consistent security coverage. Environment variable keys must be validated with `/^[a-zA-Z_][a-zA-Z0-9_]*$/` to prevent command injection when spawned in a shell.
**Prevention:** Always use the `--` separator in `git clone`. Implement a strict allowlist or denylist for headers in proxying logic. Validate all user-supplied keys used in shell environments.
