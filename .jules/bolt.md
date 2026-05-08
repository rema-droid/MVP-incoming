## 2025-03-05 - Caching expensive string processing
**Learning:** Functions like `summarizeRepoForBeginners` that perform heavy regex operations and string manipulations can become a bottleneck when rendering large lists (e.g., Marketplace or Categories). Hoisting regex constants and implementing a simple FIFO cache for these pure functions yields significant latency improvements.
**Action:** Always identify pure, expensive data transformation functions and consider hoisting constants and adding a bounded cache.

## 2025-03-05 - Memoizing derived state in components
**Learning:** Derived state calculated directly in the render body (like `listRepos.slice(0, 32)`) can cause performance issues if it's expensive or if it causes downstream components to re-render unnecessarily.
**Action:** Use `useMemo` for derived data that depends on large arrays or involves complex logic.
