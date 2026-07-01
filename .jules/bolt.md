## 2025-05-14 - Optimization of high-traffic utility functions
**Learning:** Hoisting large arrays of regex/replacement pairs and implementing a simple Map-based memoization cache in high-traffic utility functions (like `summarizeRepoForBeginners`) can yield massive performance gains (~99% reduction in execution time for cached calls) with minimal code complexity. Bounding the cache size with a FIFO eviction strategy prevents memory leaks while maintaining efficiency.
**Action:** Always look for repetitive string processing or regex-heavy logic in functions that are called within list/feed rendering loops and apply hoisting/memoization.

## 2025-05-14 - Environment Hygiene and Lockfiles
**Learning:** Running `npm install` in this environment can introduce significant noise in `package-lock.json` (removal of `"peer": true` flags).
**Action:** Always verify and potentially revert `package-lock.json` changes before submission if they are unrelated to the task at hand.
