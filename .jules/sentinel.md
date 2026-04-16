## 2025-05-14 - Command Injection via User-Controlled Repository URLs

**Vulnerability:** User-controlled repository URLs were passed directly to `exec` in `build-engine/worker.ts`, allowing for command injection via shell metacharacters (e.g., `;`, `&`, `|`). Additionally, URLs starting with a hyphen could lead to argument injection in `git clone`.

**Learning:** Using `exec` or `spawn` with `shell: true` and unsanitized user input is a critical security risk. Even seemingly "safe" commands like `git clone` can be exploited if the input is not strictly validated and handled.

**Prevention:** Always use `spawn` with an arguments array and `shell: false` (default) to prevent shell interpretation. Use the `--` separator to explicitly mark the end of options in CLI commands when passing user-controlled arguments. Validate user inputs (e.g., enforcing `https://` protocol) at the earliest possible entry point.
