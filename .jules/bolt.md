## 2026-06-18 - Bounded Memoization for Regex Heavy Logic
**Learning:** Functions performing multiple regex replacements (like `simplifyWords`) on the same input strings across re-renders are major bottlenecks. A bounded Map-based cache (FIFO) effectively eliminates this overhead.
**Action:** Identify expensive pure transformations and apply bounded memoization.
