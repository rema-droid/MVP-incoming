## 2025-05-22 - Performance optimization of RepoCard and RepoSummary

**Learning:** Regex-heavy text processing in `summarizeRepoForBeginners` was a significant bottleneck when rendering large lists of repositories (~0.03ms per call, adding up to ~300ms for 10,000 calls). React components also executed expensive logic (SVG generation) even for variants that didn't need them.

**Action:** Implemented a `Map`-based cache in `repoSummary.ts` to store processing results. Deferred expensive calculations in `RepoCard.tsx` behind variant-specific conditionals and used `React.memo` and `useMemo` to minimize main thread blocking. Always use `[...arr].sort()` instead of `arr.sort()` to avoid mutating props.
