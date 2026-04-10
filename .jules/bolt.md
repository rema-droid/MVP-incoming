## 2026-04-10 - Memoization of Repository Summary Logic
**Learning:** Repeated regex operations and string manipulations in `summarizeRepoForBeginners` and `getRepoBackdrop` were creating a bottleneck during large list renders. Moving large static arrays like `SWAPS` outside the function scope prevents redundant memory re-allocation and garbage collection pressure.
**Action:** Always check for static data defined inside hot-path functions and apply memoization to expensive string/regex processing that depends on stable input data.
