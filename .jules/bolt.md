## 2025-06-16 - Mutating props during cache key generation
**Learning:** Using `.sort()` on a prop array (like `repo.topics`) mutates the original array in place, which can cause unexpected side effects in React components and state management.
**Action:** Always use spread syntax `[...array].sort()` to create a shallow copy before sorting for cache keys.
