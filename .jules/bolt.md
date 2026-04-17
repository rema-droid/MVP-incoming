## 2025-05-22 - [Memoization & Constant Hoisting]
**Learning:** Significant performance gains can be achieved in frequently called utility functions by hoisting constant regex/data structures out of the function body and implementing size-limited memoization. This is particularly effective for components like `RepoCard` that are rendered in large lists.
**Action:** Always check for repeated regex allocations in loops or render paths. Use `Map` for simple result caching, but always cap the size to prevent memory leaks in long-running client sessions.
