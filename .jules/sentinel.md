## 2025-05-15 - Command and Argument Injection in Git Pipeline
**Vulnerability:** Command injection and argument injection via unsanitized repository URLs and IDs in the deployment worker.
**Learning:** Interpolating user-controlled strings directly into shell commands (even when they look like URLs) can lead to arbitrary code execution. Whitelisting is superior to blacklisting, and defense-in-depth (like using the `--` separator in Git) is critical.
**Prevention:** Use strict regex whitelists for URLs (e.g., `^https://...`). Sanitize internal identifiers used in filenames or database keys to alphanumeric/hyphens only. Always use command-line separators where supported to prevent argument injection.
