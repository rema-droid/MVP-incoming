## 2025-05-28 - FIFO Caching for Repository Summaries
**Learning:** The `summarizeRepoForBeginners` function in `src/lib/repoSummary.ts` is a bottleneck when rendering large lists or grids of repositories because it performs multiple string simplifications and regex matches for every repository.
**Action:** Implement module-level FIFO caching (using a `Map`) for the summary output to reduce redundant processing for the same repository metadata.
