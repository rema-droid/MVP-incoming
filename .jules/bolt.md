## 2025-04-24 - [Memoization of Repository UI logic]
**Learning:** Functions that perform repeated heavy string operations (like SVG generation and jargon replacement) in list views are major bottlenecks. Map-based FIFO caches are highly effective for these.
**Action:** Use size-limited Map caches for repetitive UI logic that depends on repository metadata.
