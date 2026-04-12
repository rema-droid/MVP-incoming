## 2025-05-14 - Repository Clone Hardening
**Vulnerability:** Argument Injection and Protocol Smuggling in `git clone` operations.
**Learning:** Malicious repository URLs starting with a hyphen (e.g., `-u...`) can be interpreted as git options. Furthermore, non-HTTPS protocols (like `file://`) can allow unauthorized access to local files on the build host.
**Prevention:** Always use the `--` separator to terminate options before the URL in git commands. Strictly validate that repository URLs use the `https://` protocol at the API entry point.
