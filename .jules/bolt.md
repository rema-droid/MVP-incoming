## 2026-04-13 - Memoization and Constant Extraction
**Learning:** Repetitive regex operations and SVG generation for repository cards were a significant bottleneck when rendering large lists (Marketplace, Feed).
**Action:** Implemented Map-based caches (limited size) for repository summaries and backdrops. Extracted large static arrays (SWAPS) outside of function scopes to prevent unnecessary memory re-allocation and GC pressure. Observed ~44x speedup for summaries and ~12x for backdrops.
