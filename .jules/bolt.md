## 2025-05-14 - Optimized Repo Summary Generation
**Learning:** Hoisting large constant arrays like `JARGON_SWAPS` and implementing size-limited memoization for expensive text transformation functions significantly reduces per-call latency.
**Action:** Use `Map` for FIFO caches with a defined `CACHE_LIMIT` and hoist constants that don't need to be re-evaluated on every function execution.
