## 2025-05-15 - [Memoization of Repository Summaries]
**Learning:** Memoizing pure functions that involve heavy regex or string operations can lead to significant (20x+) speedups in components that render large lists or grids. Using a `Map` with a `MAX_CACHE_SIZE` and a simple FIFO eviction strategy is an effective way to prevent memory leaks while maintaining high performance.
**Action:** Always consider memoizing expensive data transformation logic that is called multiple times per render or across different views with the same input data.
