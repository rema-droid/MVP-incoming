## 2025-06-28 - Command Injection in Build Worker
**Vulnerability:** User-provided GitHub URLs and repository IDs were directly interpolated into shell commands via `child_process.exec`, allowing arbitrary command execution.
**Learning:** `exec` invokes a shell, making it dangerous when handling unvalidated external input. Even with validation, a shell-less approach is safer.
**Prevention:** Use `child_process.spawn` with an array of arguments to bypass the shell entirely. Complement this with strict regex validation for all external inputs.
