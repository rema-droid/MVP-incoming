## 2026-05-30 - Caching Strategy Nuance
**Learning:** Caching can be a regression if the overhead of generating a complex cache key (sorting arrays, string concatenation) exceeds the cost of a simple function (like `friendlyCategoryLabel` which uses basic regex).
**Action:** Always benchmark the key generation cost against the raw function cost before applying memoization.
