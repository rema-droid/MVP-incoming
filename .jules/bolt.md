## 2025-05-14 - [Regular Expression Hoisting & FIFO Caching]
**Learning:** Hoisting regular expressions to the module level avoids redundant re-allocation, especially in frequently called functions like `summarizeRepoForBeginners`. Implementing a simple FIFO cache for these pure summary functions provides massive performance gains (~94% reduction in execution time for repeated inputs).
**Action:** Always hoist constants and regular expressions from high-frequency functions. Use `Map` with a simple eviction strategy for lightweight, in-memory caching of pure transformation results.
