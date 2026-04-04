## 2025-05-15 - Memoization of Repository Summaries
**Learning:** Repetitive regex and string manipulations in utility functions like `summarizeRepoForBeginners` can become a bottleneck when rendering large lists of items (e.g., 100+ repository cards).
**Action:** Implement a simple Map-based cache with a size limit to store and reuse computed summaries, significantly reducing CPU cycles during re-renders.
