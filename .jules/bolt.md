## 2026-06-17 - Bounded Map Cache for Text Processing
**Learning:** Regex-heavy text normalization and jargon replacement in `summarizeRepoForBeginners` was a significant bottleneck during repeated renders of large repository lists, taking ~53ms per 1000 calls.
**Action:** Implemented a Map-based FIFO cache with a 1000-entry limit to stabilize performance. This achieved a ~17x speedup (530ms -> 30ms for 10k iterations) for repeated processing of identical repository metadata.
