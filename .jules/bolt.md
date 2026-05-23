## 2025-05-15 - [FIFO Caching for text processing]
**Learning:** Text-heavy functions like `summarizeRepoForBeginners` that use dozens of Regex replacements can be significantly optimized (up to 20x) using a simple FIFO cache.
**Action:** Identify computationally expensive functions that are called repeatedly with the same data and implement a Map-based cache with a size limit.

## 2025-05-15 - [Immutable Cache Keys]
**Learning:** When generating cache keys from arrays (like `topics`), always sort a CLONE of the array to ensure deterministic keys without mutating the input object.
**Action:** Use `[...(repo.topics || [])].sort().join(",")` instead of mutating the input with `.sort()`.
