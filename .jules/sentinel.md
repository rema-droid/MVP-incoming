## 2025-05-14 - Command Injection in Build Engine
**Vulnerability:** The build engine worker was using `child_process.exec` to run shell commands with repository URLs and app names.
**Learning:** `exec` interprets the entire command string in a shell, making it susceptible to injection if any part of the string contains shell metacharacters (e.g., `;`, `&`, `|`, ` ` `).
**Prevention:** Use `child_process.spawn` with an argument array to pass parameters directly to the executable, bypassing the shell and its interpretation of special characters. Also, implement strict input validation (regex) at the API level to ensure only expected characters are allowed in critical fields like URLs.
