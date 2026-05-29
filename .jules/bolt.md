## 2025-05-15 - [Repo Summary Caching]
**Learning:** The `summarizeRepoForBeginners` function involves multiple regex replacements and string manipulations. Caching the result using a composite key (title, description, language, sorted topics) provides a ~15x performance boost. Shallow-cloning the cached result is essential to prevent external mutations from corrupting the cache.
**Action:** Always consider caching for pure functions that perform heavy string processing, especially when used in lists or frequent UI updates.
