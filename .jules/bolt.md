## 2025-05-22 - Regex Hoisting and Caching in String Transformations
**Learning:** Functions that perform a large number of regex replacements (e.g., jargon simplification) incur significant overhead from repeated array allocation and regex object creation. Combined with frequent calls during list rendering, this creates a measurable performance bottleneck.
**Action:** Always hoist static regex arrays to the module level. For deterministic data transformation functions, implement a size-limited FIFO cache to avoid redundant computations, especially in React render cycles.
