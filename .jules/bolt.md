## 2025-02-13 - [Global Memoization in Persistent Environments]
**Learning:** Global memoization caches in persistent environments (like long-running background tasks or SSR) must be bounded with an eviction policy (e.g., FIFO size limit) to prevent unbounded memory growth.
**Action:** Always implement a `MAX_CACHE_SIZE` and an eviction strategy (like the `setWithEviction` pattern) when adding in-memory caches to utility functions.
