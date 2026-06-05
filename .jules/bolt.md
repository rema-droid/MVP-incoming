## 2025-05-15 - [Caching in repoSummary]
**Learning:** Implementing a simple Map-based FIFO cache for `summarizeRepoForBeginners` reduced execution time by ~15x (from 0.05ms to 0.003ms per call). The bottleneck was repeated regex replacements and string manipulations for the same repository data.
**Action:** Always consider memoization or caching for utility functions that perform expensive string or data processing and are called frequently during list rendering.

## 2025-05-15 - [RepoCard Optimization]
**Learning:** Deferring expensive asset generation (like SVG backdrops) to variant-specific blocks prevents wasted cycles in the more common list view. Using `React.memo` with a `displayName` ensures consistent performance and production-grade hygiene.
**Action:** Isolate variant-specific logic in multi-purpose components to keep the hot path (like large list rendering) as lean as possible.
