## 2025-05-14 - Hoisting and Caching in String Processing Utilities
**Learning:** Constant re-allocation of large arrays and regular expressions in frequently called utility functions (like those used in list rendering) can create significant overhead. Hoisting these to the module level and implementing a simple FIFO cache for pure functions can lead to order-of-magnitude performance gains.
**Action:** Always check for regex and constant array re-allocation in utility functions called within render loops or mapping functions. Implement caching for pure functions that process stable metadata.
