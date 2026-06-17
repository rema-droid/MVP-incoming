## 2026-06-17 - Repository Metadata Caching
**Learning:** High-frequency processing of repository metadata (regex-heavy summaries and SVG generation) creates significant main-thread overhead during list rendering. Bounded Map-based caches with a FIFO eviction policy provide a massive performance boost (~14x in benchmarks) with negligible memory impact.
**Action:** Use bounded memoization for expensive computational functions that process recurring data structures like repository objects.

## 2026-06-17 - Selective Component Optimization
**Learning:** Not all component variants need the same expensive data. Deferring intensive computations (like SVG backdrops) strictly to the variants that use them (`widget` vs `list`) prevents unnecessary work on the main thread for the default view.
**Action:** Identify and defer variant-specific computations inside components to minimize the critical rendering path.
