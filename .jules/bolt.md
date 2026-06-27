## 2025-06-27 - Constant Hoisting and Memoization in `repoSummary.ts`
**Learning:** Hoisting large static arrays (like `SWAPS`) and regular expressions out of high-frequency functions into module-level constants, combined with a bounded FIFO cache, can reduce execution time by over 95%.
**Action:** Always identify logic-heavy utility functions used in render loops (like `summarizeRepoForBeginners`) and apply memoization and constant hoisting to minimize per-call overhead.
