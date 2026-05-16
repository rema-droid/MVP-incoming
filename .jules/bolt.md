## 2025-05-15 - Regex and Component Optimization
**Learning:** Re-computing complex string summaries and regex matches on every render in large lists (Marketplace/Feed) is a significant CPU bottleneck. Next.js/React components with complex SVG backdrops are particularly expensive to re-render.
**Action:** Hoist regexes to module level, implement bounded FIFO caches for string processing, and use `React.memo` for list items to skip redundant renders.
