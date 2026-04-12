## 2025-05-15 - Memoization Cache Key Collisions
**Learning:** When memoizing functions that generate UI elements (like SVG backdrops), the cache key must include all variable inputs that affect the output. Initially, `repo.owner` was missing from the `getRepoBackdrop` cache key, which could have led to different repositories sharing the same backdrop if they had the same title and category.
**Action:** Always verify that the cache key is sufficiently unique for the generated output, especially when falling back to optional fields like `repo.owner`.
