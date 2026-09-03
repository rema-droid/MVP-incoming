## 2025-05-18 - Parameterized Binary Execution in Worker Services
**Vulnerability:** Command injection in build worker (`build-engine/worker.ts`) where untrusted `githubUrl` and `repoId` fields were interpolated into shell execution strings (`exec`).
**Learning:** Shell-based command execution (`exec`) in backend worker scripts easily introduces command injection when handling dynamic URLs or IDs, even if string formatting looks benign.
**Prevention:** Always use `execFile` with array parameters rather than shell execution (`exec`), and use Node's `fs.promises.rm` for directory cleanup inside `try...finally` blocks.
