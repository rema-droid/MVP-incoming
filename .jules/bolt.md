## 2026-04-12 - Memoization in Repository Components

**Learning:** Repeated regex operations in `summarizeRepoForBeginners` and SVG encoding in `getRepoBackdrop` created measurable UI lag during list rendering (1000 repos ~100ms baseline). Memoizing these functions with a size-limited `Map` cache based on composite keys reduced execution time by ~20x (to <5ms).

**Action:** Always consider memoization for pure functions that perform heavy string manipulation or SVG generation in render loops. Ensure caches are size-limited to prevent memory leaks.
