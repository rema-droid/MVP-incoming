## 2026-08-12 - RepoCard rendering overhead
**Learning:** Instantiating and executing heavy SVG string generation, URI encoding, and theme determinations for standard list-item elements unnecessarily wastes CPU cycles and memory. Deferring heavy metadata and template calculations dynamically based on component rendering variant yields significant speedups.
**Action:** When creating component variants, lazily calculate heavier computations inside variant blocks, and always memoize lists of item components to bypass wasteful re-render cycles.
