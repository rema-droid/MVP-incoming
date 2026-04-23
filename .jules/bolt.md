## 2025-04-23 - Bounded Memoization in core library
**Learning:** Pure functions like `summarizeRepoForBeginners` that perform heavy string processing and regex operations are excellent candidates for memoization. Using a Map with a FIFO eviction policy (MAX_CACHE_SIZE) ensures bounded memory growth while providing significant performance gains (up to 800x for cached lookups).
**Action:** Always prefer bounded caches (Map + FIFO eviction) for memoizing pure, CPU-intensive functions in core library files.
