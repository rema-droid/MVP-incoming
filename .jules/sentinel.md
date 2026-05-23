## 2025-05-15 - Command Injection in Build Workers
**Vulnerability:** Remote Command Injection (RCI) via shell-concatenated strings in `exec` calls.
**Learning:** Background workers often use CLI tools like `git` or `flyctl`. Using `child_process.exec` with template strings containing user-controlled repository URLs or IDs allows attackers to escape the command and execute arbitrary code on the worker.
**Prevention:** Always use `child_process.spawn` with an arguments array. Implement a `spawnAsync` helper that wraps `spawn` and strictly separates the command from its arguments.
