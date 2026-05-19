# Sentinel Security Journal

## 2025-05-15 - Command Injection via Unsanitized Repository Metadata
**Vulnerability:** User-provided repository URLs and IDs were directly interpolated into shell commands in `build-engine/worker.ts` and `src/app/api/run/store.ts` (e.g., `git clone`, `flyctl`, `rm -rf`).
**Learning:** Even internal metadata like repository IDs can be vectors for command injection if they are not strictly validated before being used in shell contexts.
**Prevention:** Implement strict alphanumeric sanitization for IDs and regex-based protocol validation for URLs. Use native filesystem APIs instead of shell commands for file operations.
