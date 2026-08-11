## 2025-02-17 - Shell execution vulnerability in background build workers
**Vulnerability:** Remote Command Injection in worker.ts via unvalidated inputs passed to child_process.exec.
**Learning:** Using `exec` with string interpolation of user-supplied values (such as repository URLs and IDs) allows shell metacharacters to hijack execution and run arbitrary commands.
**Prevention:** Always use `execFile` (with an arguments array) instead of `exec` to bypass the shell parser completely. Additionally, enforce strict input validation using anchored regular expressions both at the API ingress point and the background execution workers.
