## 2025-07-28 - Redundant Metadata & SVG Rendering in RepoCard
**Learning:** RepoCard is heavily rendered across multiple viewports and lists (Explore, Types, Marketplace, etc.). Each render triggered complex string substitutions (simplifying 75+ jargon terms in `summarizeRepoForBeginners`) and dynamic SVG background generation (`getRepoBackdrop`), which was extremely CPU-intensive and blocked the main thread.
**Action:** Always use `useMemo` for any complex string parsing, dynamic asset/SVG generation, or lookup routines within reusable list items like RepoCard.
