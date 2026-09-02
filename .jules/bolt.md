## 2025-05-18 - Memoize NewsTicker metadata across dual-layout renders
**Learning:** `NewsTicker` renders the same repository items in both mobile (`overflow-x-auto`) and desktop (`grid-cols-3`) layouts. Computing repository summaries, SVG backdrops, and category labels dynamically inside the render loop results in duplicate expensive calculations for featured repositories on every render pass.
**Action:** Use `useMemo` to pre-compute card data per repository once and share the memoized data objects across both responsive view ports.
