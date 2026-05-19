## 2025-05-15 - [Caching repository summaries and backdrops]
**Learning:** Hoisting regular expressions and implementing simple FIFO caches for expensive UI-related computations (like SVG generation and text summarization) provides significant performance gains, especially in list-heavy views.
**Action:** Always look for repeated computations on objects with unique IDs and consider implementing a simple cache to avoid redundant work.
