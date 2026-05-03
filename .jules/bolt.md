# Bolt's Journal - Performance Learnings

## 2025-05-15 - Module-level Caching for Summary Utilities
**Learning:** Functions like `summarizeRepoForBeginners` perform expensive RegEx jargon-swapping on every call, creating a bottleneck when rendering large repository lists. While `useMemo` helps per-component, module-level caching provides a system-wide boost and prevents redundant work across different views (Explore, Feed, etc.).
**Action:** Implement a FIFO-limited `Map` cache in `src/lib/repoSummary.ts` to memoize summarization results. Always return shallow clones to prevent cache poisoning.
