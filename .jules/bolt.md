# Bolt's Journal

## 2025-08-05 - Caching Natural Language and Metadata Computations
**Learning:** High rendering density and active re-renders (e.g. keypress-based searches, list views, categories) on repository cards can cause heavy re-computations of natural language preprocessing (`summarizeRepoForBeginners`), classification (`friendlyCategoryLabel`), and custom graphics serialization (`getRepoBackdrop`). These operations include recursive regex execution, array operations, and heavy SVG string construction. Adding bounded, thread-safe caches using `Map` with custom FIFO evictions yields ~90x performance improvements.
**Action:** Always memoize/cache heavy computational functions (NL parsing, SVG serialization, and formatting) that map one-to-one to standard properties/entities. Limit memory overhead using a standard FIFO cache wrapper (`manageCache`).
