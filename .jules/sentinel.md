## 2025-05-14 - Hardening Build Worker and API Input
**Vulnerability:** Potential command injection and argument injection in the build-engine worker through unsanitized repository URLs and IDs.
**Learning:** Repository URLs were used directly in `git clone` without the `--` separator, allowing potential argument injection. Repository IDs were used to construct shell-executed directory names and Fly app names without sanitization. Shell-based cleanup (`rm -rf`) was used instead of native Node.js APIs.
**Prevention:** Always use the `--` separator in `git clone` to isolate the URL. Sanitize all user-provided IDs using a whitelist of safe characters (e.g., alphanumeric and hyphens). Prefer native filesystem APIs (`fs.promises.rm`) over shell commands for safer operations.
