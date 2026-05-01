## 2025-05-14 - Repo summarization bottlenecks
**Learning:** Frequent re-allocation of large regex arrays and redundant string processing in `RepoCard` rendering loops (via `summarizeRepoForBeginners` and `friendlyCategoryLabel`) can cause significant overhead (~0.1ms per card). Unchecked, this can lead to jank in long lists.
**Action:** Hoist regex constants to module level and implement bounded Map-based memoization for expensive string-to-prose transformations. Always return shallow clones of cached objects to prevent mutation of the cache.
