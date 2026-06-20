## 2025-05-14 - Hoisting regexes and static arrays for text processing
**Learning:** Functions that perform extensive text replacement using a large list of patterns (e.g., 70+ jargon swaps) suffer from significant allocation overhead when those patterns are defined inline. Hoisting them to module-level constants reduces execution time by 10-20% on hot paths.
**Action:** Always identify and hoist static data structures and Regex literals in high-frequency utility functions.

## 2025-05-14 - Dependency management in hybrid environments
**Learning:** Using `pnpm install` in an environment that defaults to `npm` (`package-lock.json`) can create a `pnpm-lock.yaml` with different dependency resolutions, leading to TypeScript type errors (e.g., `ioredis` type mismatches in `bullmq`).
**Action:** Use `npm install` and `npm run build` to maintain the existing lockfile and ensure environment consistency.
