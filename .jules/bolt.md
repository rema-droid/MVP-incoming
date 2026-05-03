## 2025-05-14 - FIFO Caching for Text Processing
**Learning:** Repetitive regex processing and string manipulation in core utility functions (like `summarizeRepoForBeginners`) can be a significant bottleneck when rendering large lists of components. Hoisting constants and implementing a size-limited FIFO cache can provide a ~16x speedup.
**Action:** Always check if frequently called utility functions can be memoized using a `Map` with a `CACHE_LIMIT` and FIFO eviction. Ensure cached objects are shallow-cloned to prevent cache poisoning.
