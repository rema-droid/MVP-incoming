# Bolt's Performance Journal

## 2025-07-30 - Caching Metadata Processing
**Learning:** Functions like `summarizeRepoForBeginners` and `friendlyCategoryLabel` are heavily queried in rendering loops (e.g., search queries, interval polling). Re-compiling regexes and allocating jargon-swapping structures on every single rendering pass introduces significant microsecond overhead that aggregates into frames dropped on search interactions.
**Action:** Hoist the jargon-swap `SWAPS` array and other repository classification regexes, and implement a high-performance 1000-entry Map FIFO cache for `summarizeRepoForBeginners` and `friendlyCategoryLabel` using O(1) repository ID lookups.
