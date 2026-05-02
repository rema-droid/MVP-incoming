
## 2025-05-15 - FIFO Caching and Constant Hoisting for Text Processing
**Learning:** Functions performing extensive regex-based text manipulation (like jargon simplification and summary generation) become significant bottlenecks when rendering long lists. Hoisting large mapping arrays prevents repeated re-allocations, and implementing a size-limited FIFO Map cache can provide up to a 7000x speedup for repeated calls without unbounded memory growth.
**Action:** Always check for repeated expensive computations in list-rendering paths and consider a Map-based FIFO cache with a robust composite key (id + relevant properties) and strict size limits.
