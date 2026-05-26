## 2025-05-15 - Command Injection via Shell Execution
**Vulnerability:** Command injection in `build-engine/worker.ts` due to using `child_process.exec` with unsanitized user-provided repository URLs and IDs.
**Learning:** `exec` spawns a shell, which interprets special characters like `;`, `&`, and `|`, allowing an attacker to execute arbitrary commands by embedding them in input fields.
**Prevention:** Always use `child_process.spawn` with an arguments array to execute external commands. This bypasses shell parsing and ensures that arguments are treated as literal strings. Additionally, sanitize all user-controlled identifiers used in shell-sensitive contexts.
