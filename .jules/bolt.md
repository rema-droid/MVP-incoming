## 2025-05-15 - [Memoization & Regex Optimization]
**Learning:** Functions involving heavy string manipulation (like SVG generation with URI encoding) and complex regex-based categorization are significant bottlenecks when rendering large lists of items (e.g., Repo cards). Hoisting large regex arrays prevents redundant allocations.
**Action:** Always consider size-limited memoization for idempotent functions that process repository metadata. Hoist regex-based translation maps to the module level.
