## 2025-05-15 - Command and Argument Injection in Build Engine
**Vulnerability:** The build engine used `child_process.exec` with unsanitized repository URLs and IDs, leading to shell command injection. Additionally, `git clone` was vulnerable to argument injection if a repository URL started with a hyphen.
**Learning:** Even if using `spawn` to avoid shell injection, tools like `git` or `rm` can be vulnerable to argument injection. Using `--` as a separator is a critical defense-in-depth measure.
**Prevention:** Always use `spawn` with an arguments array. Use `--` to separate options from user-controlled positional arguments. Sanitize all inputs used in paths or identifiers.
