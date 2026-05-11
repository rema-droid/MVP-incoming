# Bolt's Journal - Performance Learnings

## 2025-05-15 - Initial Journal
**Learning:** Initializing journal for performance tracking.
**Action:** Always measure before and after optimizations.

## 2025-05-15 - Optimizing `repoSummary.ts`
**Learning:** Functions that perform heavy regex replacements and object creations (like `summarizeRepoForBeginners`) can be significant bottlenecks when called repeatedly in loops (e.g., in `page.tsx`). Hoisting constants and adding a simple FIFO cache can yield ~30x speedups.
**Action:** Always check for redundant computations in utility functions used in component render paths or list mappings.
