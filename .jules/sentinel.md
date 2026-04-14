## 2025-05-15 - Command Injection in Build Engine
**Vulnerability:** The build engine used `child_process.exec` to run shell commands with unsanitized user inputs (`githubUrl`, `appName`), creating a high-risk command injection vulnerability.
**Learning:** Using `exec` with template literals is inherently dangerous. Even with basic validation, shell meta-characters can be used to execute arbitrary code.
**Prevention:** Always use `child_process.spawn` with an arguments array to bypass the shell entirely. Additionally, use the `--` separator for CLI tools like `git` to prevent argument injection.
