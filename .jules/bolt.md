## 2025-05-15 - Caching Expensive String Processing

**Learning:** The `summarizeRepoForBeginners` function, which performs multiple regex-based replacements and jargon swaps, was identified as a significant bottleneck (~34ms per call in large lists). While React handles rendering efficiently, the underlying data transformation logic was running redundantly for the same repository data across different views (Marketplace, Feed, Ticker).

**Action:** Implement a module-level FIFO cache (Map-based) for pure data transformation functions that are called frequently with the same inputs. Always use a composite key of all relevant inputs to ensure correctness.
