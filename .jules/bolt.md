## 2025-05-14 - Constant Hoisting and FIFO Caching in repoSummary
**Learning:** Found that `JARGON_SWAPS` was being re-allocated on every call, creating significant GC pressure. Also, caching `RepoSummary` objects requires shallow cloning (especially the `goodForPills` array) to prevent callers from accidentally poisoning the cache by mutating the results.
**Action:** Always hoist static mapping arrays/RegExps to module level. When implementing module-level caches, use a FIFO eviction policy (via `Map.keys().next()`) to bound memory usage and return shallow clones of non-primitive values.
