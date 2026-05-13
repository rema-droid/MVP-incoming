## 2025-05-14 - [Command and Argument Injection in Build Worker]
**Vulnerability:** Use of `child_process.exec` with unsanitized repository URLs and IDs allowed for shell command injection. Additionally, missing `--` separator in `git clone` made the application vulnerable to argument injection.
**Learning:** Shell execution (`shell: true`) is extremely dangerous when combined with user-provided strings. Even with regex validation, subtle bypasses can exist.
**Prevention:** Always use `child_process.spawn` with `shell: false` and pass arguments as an array. Use the `--` separator for CLI tools that support it to demarcate positional arguments from flags.
