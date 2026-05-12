## 2026-05-12 - Summary Generation Cache
**Learning:** `summarizeRepoForBeginners` was a significant performance bottleneck due to complex regex operations and text processing being executed on every render.
**Action:** Implement a FIFO cache with a size limit (500 entries) and hoist regex/lookup tables to module scope to reduce CPU cycles and memory allocations.
