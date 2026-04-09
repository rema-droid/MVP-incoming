## 2025-05-14 - Initial Performance Audit
**Learning:** Found that core repository summary functions (summarizeRepoForBeginners, friendlyCategoryLabel) and SVG backdrop generation (getRepoBackdrop) are major bottlenecks, taking ~3200ms for 50,000 calls. This impacts list rendering and search responsiveness.
**Action:** Implement Map-based memoization with composite keys and move static configuration (SWAPS) out of function scopes to reduce GC pressure and redundant computations.
