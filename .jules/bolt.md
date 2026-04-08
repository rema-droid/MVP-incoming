## 2025-05-15 - [Regex Hoisting and Memoization]
**Learning:** Re-allocating large arrays of Regular Expressions inside frequently called functions (like `simplifyWords`) is a common performance bottleneck. Hoisting these to module scope provides an immediate boost (~12x speedup in this codebase).
**Learning:** For idempotent text processing functions, simple `Map`-based memoization significantly reduces execution time when the input set is repetitive (e.g., repository data in list views), provided the cache is bounded to prevent memory leaks.
**Action:** Always hoist heavy constants or regexes out of function bodies. Implement bounded caches for complex processing to balance speed and memory usage.
