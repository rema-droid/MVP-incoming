## 2025-05-15 - [Memoization of Repository Summaries]
**Learning:** Functions performing complex regex matching and string manipulation (like `summarizeRepoForBeginners` and `friendlyCategoryLabel`) are significant performance bottlenecks when called frequently in lists or grids. Memoization using a simple `Map` can provide a massive speedup (~95% faster) for repeat calls.
**Action:** Always check for expensive pure functions in critical render paths (lists, cards, feeds) and implement bounded caching where appropriate.
