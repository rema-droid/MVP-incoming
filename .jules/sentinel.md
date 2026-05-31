# Sentinel Security Journal

## 2025-05-14 - Command Injection in Build Engine
**Vulnerability:** The build engine was using `child_process.exec` with unsanitized repository URLs and application names, allowing for remote command injection.
**Learning:** Using `exec` with string interpolation of user-provided data is dangerous as shell metacharacters can be used to execute arbitrary commands.
**Prevention:** Always use `child_process.spawn` with an array of arguments instead of a single command string, and validate all user-provided URLs against a strict allowlist.
