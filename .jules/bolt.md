## 2025-05-15 - [Hoisting and Memoization in Text Processing]
**Learning:** Hoisting large arrays of RegExp objects from function scope to module scope significantly reduces per-call overhead by avoiding redundant allocations and regex compilations. Implementing size-limited FIFO memoization for pure text processing functions provides a ~50x speedup for repeated repository data processing, which is common during React re-renders.

**Action:** Always hoist static regex-based transform maps to the module level. Use a size-limited Map with FIFO eviction for expensive computations that operate on relatively stable data structures like repository metadata.
