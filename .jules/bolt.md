## 2026-04-01 - Optimizing list rendering with RepoCard
**Learning:** Rendering large lists of repositories in different variants ("list" vs "widget") can be expensive if non-visible logic (like SVG generation for backdrops) is executed for all items.
**Action:** Always defer expensive, variant-specific computations behind conditional blocks and use `React.memo` with `useMemo` to stabilize props and results.

## 2026-04-01 - Global caching vs useMemo
**Learning:** While `useMemo` is great for component-level stability, a global cache (with FIFO eviction) for expensive pure functions like `summarizeRepoForBeginners` prevents redundant work when the same repository appears in different parts of the UI (e.g., NewsTicker and MarketplaceView).
**Action:** Use a global bounded cache for pure utility functions that process stable external data (like GitHub repo metadata).
