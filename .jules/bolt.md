## 2025-05-14 - Map-based Memoization for CPU-intensive string processing
**Learning:** CPU-intensive string processing in utility functions (like `summarizeRepoForBeginners`) that are called during list rendering can significantly degrade performance. Implementing a bounded Map-based cache for these functions yielded a ~12x performance improvement (from ~288ms to ~23ms for 10,000 calls).
**Action:** Always profile utility functions used in hot loops or list rendering. If they perform heavy regex or string manipulations on stable inputs, apply memoization early.
