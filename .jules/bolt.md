## 2025-05-14 - [Initial Performance Optimization]
**Learning:** Found that `summarizeRepoForBeginners` and `friendlyCategoryLabel` are called repeatedly for the same repositories in various list views, performing redundant regex operations and text processing.
**Action:** Implement memoization and hoist constants to improve performance in list-heavy views like Marketplace and Feed.
