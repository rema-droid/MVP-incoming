## 2025-05-15 - [Memoization with FIFO Cache Eviction]
**Learning:** In long-running client-side applications with large datasets (like repo lists), basic memoization can lead to memory leaks. Using a `Map` and a size limit with a FIFO eviction strategy (`cache.delete(cache.keys().next().value)`) provides an effective balance between performance gains and memory safety.
**Action:** When implementing memoization for data-driven UI components, always specify a maximum cache size and an eviction policy to ensure the application remains stable over time.
