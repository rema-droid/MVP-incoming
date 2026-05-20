## 2025-05-14 - Optimized Repository Summary and Backdrop Generation
**Learning:** Caching results of computationally expensive operations (like regex heavy string processing and SVG generation) significantly improves performance, especially when these functions are called repeatedly for many items in a list.
**Action:** Use Map-based FIFO caches for deterministic functions that process repository metadata. Hoist large constants (like jargon swap maps) out of function bodies to avoid re-allocation.
