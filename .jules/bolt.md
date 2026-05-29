## 2025-05-14 - Selective Memoization for Repo Summaries
**Learning:** In this codebase, `summarizeRepoForBeginners` in `src/lib/repoSummary.ts` is an expensive operation due to multiple regex-based jargon replacements and complex logic. However, `getRepoBackdrop` in `RepoCard.tsx` is relatively cheap, and the overhead of generating a stable cache key (sorting and joining topics) can negate the performance gains for such simple string-building functions.

**Action:** Prioritize memoizing functions with heavy regex or iterative string processing like `summarizeRepoForBeginners`. Avoid memoizing simple template-literal based functions like `getRepoBackdrop` where the key generation cost is comparable to the function execution time. Always return clones from caches to maintain immutability.
