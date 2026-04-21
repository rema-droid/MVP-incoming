## 2025-05-15 - Baseline performance for repo summary and backdrop
**Learning:** Baseline latency for key functions identified as potential bottlenecks:
- `summarizeRepoForBeginners`: ~0.05ms/call
- `getRepoBackdrop`: ~0.017ms/call
- `friendlyCategoryLabel`: ~0.0012ms/call
These functions are called frequently during rendering of long lists (Marketplace, Discover), so memoization and constant hoisting should provide a measurable boost.
**Action:** Implement hoisting and memoization.
