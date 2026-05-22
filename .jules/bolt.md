## 2025-05-15 - Regex Hoisting and Result Caching
**Learning:** Recreating dozens of `RegExp` objects inside a hot function (like jargon simplification) introduces measurable overhead. Additionally, expensive text processing and categorization logic can be significantly optimized using a simple module-level `Map` cache with a fixed size limit.
**Action:** Always hoist static `RegExp` objects to the module level. Implement lightweight FIFO caching for expensive idempotent computations in utility libraries.
