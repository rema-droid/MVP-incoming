## 2026-04-11 - Memoization of Repository Summaries
**Learning:** Repetitive regex and string processing in utility functions (like repository summary generation) can become a significant bottleneck when rendering long lists or marketplaces. Hoisting static data and implementing simple LRU-limited Map caches can yield up to 20x performance improvements.
**Action:** Always check if core utility functions used in loops or high-frequency renders can be memoized using composite keys of their inputs.
