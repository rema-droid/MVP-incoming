## 2025-05-14 - Hardening Repository Cloning and Job Identifiers

**Vulnerability:**
The application was vulnerable to Argument Injection and Command Injection through unsanitized repository URLs and IDs. A malicious URL starting with a hyphen (e.g., `-u...`) could be interpreted as a Git option, and unsanitized IDs could lead to path traversal or shell injection in build commands.

**Learning:**
Passing user-controlled strings directly into shell commands or as arguments to external binaries (like `git clone`) is inherently dangerous. Even when using `exec` or `spawn`, the specific behavior of the underlying binary (like how Git parses options) can be exploited if the `--` separator is missing.

**Prevention:**
1. Always use the `--` separator when passing user-provided strings as positional arguments to CLI tools (e.g., `git clone -- <url>`).
2. Implement strict input validation (regex) as early as possible (at the API entry point).
3. Sanitize identifiers used in file paths and shell commands to a minimal safe character set (e.g., `[a-zA-Z0-9-]`).
4. Apply "Defense in Depth" by validating inputs at multiple layers (API and Worker).
