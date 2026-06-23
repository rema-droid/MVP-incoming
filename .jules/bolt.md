## 2025-05-14 - Redundant regex compilation and string processing in high-frequency functions
**Learning:** Functions like `summarizeRepoForBeginners` in `src/lib/repoSummary.ts` were re-compiling ~80 regexes and re-allocating a large swap array on every call, leading to significant overhead when rendering long lists of repositories.
**Action:** Hoist static constants (regexes, lookup tables) to the module level and implement bounded memoization for expensive processing of repeatable data structures.
