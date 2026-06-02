## 2025-05-15 - Caching `summarizeRepoForBeginners`
**Learning:** Repetitive string manipulation and jargon replacement in `summarizeRepoForBeginners` can be measurably improved with a simple FIFO cache. In this codebase, the function takes ~0.029ms per call, which adds up when rendering long lists of repositories. A cache reduced this to ~0.003ms.
**Action:** Use a `Map` based FIFO cache for pure functions that perform expensive string transformations, ensuring a composite key is used and a size limit is enforced to prevent memory leaks.
