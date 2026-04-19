## 2025-05-14 - [Memoization of Repository Summaries and Backdrops]
**Learning:** Repetitive string transformations (regex swaps) and SVG generation with URL encoding were consuming significant CPU time in the repository card rendering path. `summarizeRepoForBeginners` was taking ~0.09ms per call, which adds up quickly when rendering dozens of cards in the marketplace.

**Action:** Implement size-limited `Map` caches for expensive pure functions and hoist static data (like regex arrays) to the module level. This reduced call time to ~0.002ms (~39x speedup).
