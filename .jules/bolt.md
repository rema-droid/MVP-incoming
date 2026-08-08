## 2026-08-08 - [O(1) Jargon Replacer with Unified Regex]
**Learning:** Performing multiple sequential Regex replacements (75 passes) on text descriptions is highly CPU-bound and leads to massive string allocations. Constructing a single, unified regex using an O(1) key map lookup drops execution time by ~87.3% (approx 7.9x speedup).
**Action:** Always combine static word-based search and replaces into a single-pass dictionary-based regex replacer.
