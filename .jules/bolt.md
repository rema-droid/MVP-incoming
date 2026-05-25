## 2025-05-15 - [Text Processing & SVG Generation Caching]
**Learning:** Repetitive text processing (regex-heavy) and complex SVG generation/encoding are major CPU bottlenecks when rendering long lists or feeds. Hoisting regexes and implementing FIFO caches provides massive speedups with minimal memory overhead.
**Action:** Always look for module-level hoisting of expensive objects and use Map-based caches with size limits for pure functions in high-traffic components.
