## 2025-05-14 - Optimization of Repository Summary Logic
**Learning:** Moving large static arrays of regular expressions outside of frequently called functions and implementing simple Map-based memoization can lead to massive performance gains (in this case, ~8.6x faster) without adding complex dependencies.
**Action:** Always check for constant hoisting opportunities and consider memoization for pure data transformation functions that are called repeatedly in the UI (e.g., in list renderings).
