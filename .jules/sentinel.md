## 2025-05-15 - Command Injection and Insecure Randomness Fixes
**Vulnerability:** Potential command injection in `build-engine/worker.ts` via unsanitized `githubUrl` and `repoId` (used in `appName`) passed to `execAsync`. Also, insecure random token generation using `Math.random()` in `src/app/api/run/store.ts`.
**Learning:** Background workers that execute shell commands are high-risk areas. Even if the input seems "internal" (like a repo ID), it can be manipulated if not strictly validated at all boundaries. `Math.random()` is not suitable for generating security-sensitive tokens like passwords or URLs.
**Prevention:**
1. Use strict regex whitelisting for all inputs passed to shell commands.
2. Centralize security constants and utilities to ensure consistency across the main app and microservices.
3. Use `crypto.randomBytes` for any security-sensitive random data generation.
4. Duplicate security regexes in microservices to maintain isolation if sharing a library is complex.
