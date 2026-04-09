## 2025-05-15 - [Memoization of Repository Summaries and Backdrops]
**Learning:** Repetitive execution of complex regex chains and SVG string manipulations with URI encoding creates a significant performance bottleneck in list-heavy views. Moving static patterns out of function scope and implementing capped `Map` caches provides a massive (26x) performance boost.
**Action:** Always check for redundant computations in frequently rendered components or utility functions. Use module-scoped constants for static data like regex arrays to avoid re-allocation.
