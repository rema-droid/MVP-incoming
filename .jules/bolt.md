## 2026-05-02 - FIFO Caching for Repo Summaries
**Learning:** Implementing a FIFO cache using a `Map` and `cache.keys().next().value` for eviction provides a significant performance boost (up to 92x speedup in benchmarks) for expensive string-processing functions like `summarizeRepoForBeginners` while preventing unbounded memory growth.
**Action:** Use size-limited FIFO caching for any utility functions that perform heavy regex or string manipulation on repeated data sets.
