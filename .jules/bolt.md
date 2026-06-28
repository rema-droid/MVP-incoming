## 2025-05-14 - Optimizing high-traffic utility functions
**Learning:** High-frequency utility functions (like `summarizeRepoForBeginners` in `src/lib/repoSummary.ts`) that are consumed by multiple UI components can become major bottlenecks if they perform redundant allocations (e.g., large arrays or regexes) or expensive string manipulations on every call.
**Action:** Hoist static constants and regexes out of the function scope and implement a simple, bounded FIFO cache to memoize results for identical inputs.
