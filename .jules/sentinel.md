## 2025-05-15 - Command Injection in Deployment Worker
**Vulnerability:** The `build-engine/worker.ts` used `child_process.exec` (via `promisify(exec)`) to run `git clone` and `flyctl` commands using string interpolation of a user-provided repository URL.
**Learning:** Using `exec` with shell=true (default) is extremely dangerous when any part of the command string comes from user input, as shell metacharacters can be used to execute arbitrary commands.
**Prevention:** Always use `child_process.spawn` with `shell: false` and an argument array to ensure that arguments are not interpreted by a shell. Additionally, validate all external input (like URLs) against a strict whitelist regex early in the request lifecycle.

## 2025-05-15 - Protocol-Relative URL Injection in Proxies
**Vulnerability:** The proxy route `src/app/api/run/[jobId]/open/[...path]/route.ts` constructed an `upstream` URL by joining a leading slash with user-provided path segments. If the path segments started with a slash, it resulted in a path starting with `//`, which the `URL` constructor interprets as a protocol-relative URL, potentially allowing SSRF or open redirects.
**Learning:** In Next.js dynamic routes, path segments must be carefully joined and sanitized. The `URL` constructor's behavior with leading double-slashes can be surprising and dangerous in proxy scenarios.
**Prevention:** Sanitize constructed paths to collapse multiple leading slashes into a single slash before passing them to the `URL` constructor.
