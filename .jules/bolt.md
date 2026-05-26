## 2025-05-14 - [Memoization of expensive pure functions]
**Learning:** Functions that perform heavy string manipulation, regex matching, or URI encoding (like generating SVG backdrops or summarizing text) can be major bottlenecks when rendering large lists in React. Implementing a simple FIFO cache using a `Map` provides significant performance gains (up to 25x) with minimal complexity.
**Action:** Always profile list rendering components and identify if they call pure but expensive functions. Use a module-level `Map` with a size limit to cache these results safely.
