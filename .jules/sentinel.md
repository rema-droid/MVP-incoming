## 2025-05-14 - Harden Subprocess Execution in Build Engine
**Vulnerability:** Command injection via unsanitized user-provided repository URLs and IDs passed to `child_process.exec`.
**Learning:** Build engines that execute CLI tools (git, flyctl) are highly susceptible to shell injection if they use `exec` with string interpolation. Input validation via regex is necessary but not sufficient; the execution method itself must be hardened.
**Prevention:** Always use `child_process.spawn` or `execFile` with an array of arguments to bypass the shell. Wrap execution in a `try...finally` block to ensure workspace cleanup regardless of success or failure.
