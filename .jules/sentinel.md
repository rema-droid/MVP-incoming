## 2025-05-01 - Command and Argument Injection in Worker
**Vulnerability:** The build worker was susceptible to command injection and argument injection via unsanitized `repoId` and `githubUrl` parameters.

**Learning:** When passing user-controlled strings to shell commands (like `git clone` or `flyctl`), even if they appear to be "IDs" or "URLs", they must be strictly sanitized. A malicious URL starting with a hyphen could be interpreted as a command-line flag (argument injection), and unsanitized IDs used in file paths can lead to path traversal.

**Prevention:**
1. Always use the `--` separator for CLI commands to distinguish flags from positional arguments (e.g., `git clone -- <url>`).
2. Strictly sanitize all identifiers used in file system paths or shell commands using a whitelist regex (e.g., `/[^a-zA-Z0-9-]/g`).
3. Validate URLs at the API entry point using a restrictive regex before they reach background workers.
>>>>>>> REPLACE
