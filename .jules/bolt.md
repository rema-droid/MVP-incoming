## 2025-05-14 - Optimized repo summary generation
**Learning:** Hoisting frequently used regular expressions and mapping arrays to module-level constants, combined with a simple FIFO-evicted Map cache, significantly reduces latency for repetitive computations like repository summarization.
**Action:** Always check for opportunities to hoist constants out of frequently called functions and consider memoization for expensive computations.
