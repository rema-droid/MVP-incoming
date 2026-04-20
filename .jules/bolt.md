## 2026-04-20 - [Memoization & Hoisting in repoSummary]
**Learning:** Hoisting a large array of over 70 regular expressions to the module level and implementing size-limited FIFO memoization for pure metadata processing functions provided a ~20x speedup (from 0.038ms to 0.0019ms per call).
**Action:** Always look for frequently called pure functions that perform regex-heavy string transformations and apply hoisting/memoization.
