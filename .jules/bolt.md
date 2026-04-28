## 2025-05-14 - Constant Hoisting and Size-Limited Memoization
**Learning:** Hoisting large arrays containing Regex objects (like JARGON_SWAPS) out of frequently called functions prevents redundant re-allocation and compilation on every call. Adding a Map-based cache for expensive summary logic further reduces CPU overhead, but requires careful key selection (including 'stars' and 'id') to avoid stale results.
**Action:** Always hoist static data to module scope and implement size-limited FIFO caches for pure functions that process repetitive data structures like repository objects.
