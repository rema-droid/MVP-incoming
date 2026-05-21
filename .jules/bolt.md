## 2025-05-15 - Caching expensive SVG generation and text processing
**Learning:** Hoisting large arrays of static data (like jargon maps) and regex collections out of functions prevents expensive re-allocation and re-compilation on every call. Implementing a simple FIFO cache for these results provides a massive performance boost for redundant data processing.
**Action:** Always check if frequent computations (SVG generation, complex regex-heavy text transformations) can be memoized with a module-level `Map` and capped for memory safety.
