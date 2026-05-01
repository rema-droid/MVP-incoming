## 2025-05-01 - Regex Hoisting and FIFO Memoization
**Learning:** Repetitive string transformations using large arrays of Regex objects can be a significant bottleneck when rendering large lists (like repository cards). Hoisting these to module level and adding a size-limited Map cache provides an order-of-magnitude speedup.
**Action:** Always check if string processing logic inside render loops or frequently called library functions can be memoized or if object allocations can be hoisted.
