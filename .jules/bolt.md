## 2025-05-15 - [Memoization and Regex Hoisting in Repo Summary]
**Learning:** Hoisting large static arrays of regular expressions out of hot function paths and adding simple Map-based memoization can yield massive performance gains (~19x speedup) for text processing logic that handles repetitive repository data.
**Action:** Always check if large regex lists or constant lookup tables are defined inside frequently-called functions and move them to module scope. Add bounded caches for expensive deterministic computations.
