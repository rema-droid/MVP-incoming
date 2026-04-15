## 2025-05-15 - Caching heavy text processing and SVG generation
**Learning:** Repetitive calls to functions involving heavy regex scanning (`simplifyWords`, `friendlyCategoryLabel`) and URI encoding of large strings (`getRepoBackdrop`) create significant overhead in list renders. Hoisting static regex arrays and implementing simple `Map`-based caches provides an order-of-magnitude speedup (~15x) for these hotspots.
**Action:** Always identify pure functions that process text or generate assets based on repository metadata and apply memoization with composite keys and size limits.
