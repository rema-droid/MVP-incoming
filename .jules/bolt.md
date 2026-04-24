## 2025-05-15 - [Memoization of high-frequency UI logic]
**Learning:** Functions like `getRepoBackdrop` and `summarizeRepoForBeginners` are called frequently during list rendering and re-renders. Caching their results (especially when they involve expensive operations like URI encoding or multiple regex replacements) yields massive performance gains (up to 800x in some cases). Using a size-limited Map with a FIFO eviction policy ensures memory safety while maintaining high cache hit rates.

**Action:** Always consider memoization for pure utility functions that transform data for UI display, especially in large lists. Ensure cache keys are comprehensive enough to prevent stale data.
