## 2025-05-14 - [CRITICAL] Command Injection in Build Engine
**Vulnerability:** The build engine used `child_process.exec` with template literals to run `flyctl`, `git`, and `rm` commands. This allowed arbitrary shell command execution if `repoId` or `githubUrl` contained shell metacharacters.
**Learning:** Using `exec` defaults to spawning a shell (`/bin/sh`), which interprets special characters like `;`, `&`, and `|`.
**Prevention:** Always use `child_process.spawn` with `shell: false` and pass arguments as an array. Sanitize any input used in system-level names (like Fly app names or directory paths) and use the `--` separator for CLI tools that accept URLs/paths to prevent argument injection.
