## 2025-05-18 - Background Worker Command Injection

**Vulnerability:** Shell command injection in background worker (`build-engine/worker.ts`) via `execAsync` string interpolation of untrusted `job.data.githubUrl` and `job.data.repoId`.
**Learning:** Background workers consuming jobs from queues (e.g. BullMQ/Redis) can process payloads produced elsewhere or injected directly into Redis, bypassing API-layer input validation if worker logic relies on shell execution (`exec`).
**Prevention:** Always use parameterized execution APIs (`execFile`/`spawn`) with argument arrays instead of shell strings (`exec`), strictly validate URLs (`new URL()`), sanitize identifiers (`repoId`), use `--` flags for git commands, and place cleanup (`rm`) in `try...finally` blocks.
