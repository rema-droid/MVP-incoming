## 2025-05-14 - Memoization for Repository Summaries and Backdrops
**Learning:** Repetitive heavy computations like SVG generation and complex regex-based string replacements in render loops significantly benefit from simple Map-based memoization.
**Action:** Use Map caches with composite keys for pure functions that process repository data in lists or feeds.
