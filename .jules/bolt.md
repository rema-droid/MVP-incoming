## 2025-05-14 - Prevent Memory Leaks with Bounded Caches
**Learning:** When implementing memoization with a global cache (like a `Map`) in environments where the process might persist (like Next.js SSR or a long-running SPA session), always use a bounded cache with an eviction policy (e.g., FIFO or LRU). An unbounded `Map` will grow indefinitely as new unique inputs are processed, eventually leading to a memory leak.
**Action:** Always include a `MAX_CACHE_SIZE` and an eviction mechanism (like `summaryCache.delete(summaryCache.keys().next().value)`) when adding global memoization.
