## 2025-05-14 - [Hoisting & Memoization Optimization]
**Learning:** Significant performance bottlenecks were found in `src/lib/repoSummary.ts` due to frequent re-creation of a large `SWAPS` array (containing ~70 RegEx objects) and redundant processing of repository metadata. Hoisting the array to the module level and implementing a size-limited FIFO memoization cache reduced `summarizeRepoForBeginners` latency by ~25x (from ~0.034ms to ~0.0013ms).

**Action:** Always check for frequently called utility functions that instantiate complex objects or perform repetitive transformations. Use module-level constants and size-limited caches (`Map` with FIFO eviction) to minimize CPU overhead and GC pressure.
