## 2025-05-15 - Hardened Memoization in Repo Summary
**Learning:** Returning cached object references that contain arrays or nested objects can lead to cache poisoning if a consumer modifies the returned value. Additionally, cache keys must include all variables that affect the output (e.g., `stars` for summaries that include popularity badges).
**Action:** Always return clones (shallow or deep as needed) when serving from a cache, and ensure the cache key generation logic is comprehensive.
