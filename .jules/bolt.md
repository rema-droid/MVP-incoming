## 2025-05-14 - [Repository Summary Bottleneck]
**Learning:** Functions like `summarizeRepoForBeginners` and `getRepoBackdrop` are called frequently during list rendering. Extensive regex matching and SVG generation/encoding in these functions create significant CPU overhead and garbage collection pressure.
**Action:** Always memoize expensive text-processing and asset-generation functions that depend on repository metadata, and hoist regex constants to the module level.
