## 2025-05-15 - Regex-heavy text processing bottleneck
**Learning:** Functions like `summarizeRepoForBeginners` that perform dozens of regex replacements (e.g., via `simplifyWords`) can become a major bottleneck when rendering lists of items. Re-allocating large arrays of regexes inside a function also adds unnecessary overhead.
**Action:** Move static regex/swap arrays to module-level constants and implement bounded Map-based memoization for expensive text-processing functions to achieve >20x speedups.
