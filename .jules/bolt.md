## 2025-05-14 - Optimizing Repo Metadata Processing

**Learning:** Hoisting large arrays of regular expressions and string replacement pairs (like jargon swaps) significantly reduces cold-start execution time per call by avoiding re-allocation and re-initialization. Bounded memoization provides a 99%+ speedup for hot paths (e.g., re-renders of the same repository list).

**Action:** Always hoist static regexes and data-driven rule sets in utility functions that process large sets of metadata. Use a stable unique ID for cache keys when available.
