## 2025-05-14 - [Caching and Hoisting in repoSummary and RepoCard]
**Learning:** Hoisting large constant arrays and regexes to the module level reduces re-allocation and re-compilation overhead. Internal FIFO caching for expensive text processing and SVG generation provides massive performance gains (up to 60x for summaries and 12x for backdrops).
**Action:** Always check for repeated expensive operations that depend on stable data (like repository metadata) and implement internal Map-based caches with FIFO eviction to maintain a stable memory footprint.
