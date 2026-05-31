## 2026-05-31 - Redundant SVG generation and Re-renders

**Learning:** In list views with many items, unconditionally calling expensive SVG generation functions (like `getRepoBackdrop`) in the render body of a component causes significant overhead, especially during frequent state updates like search input typing.

**Action:** Always move heavy computation/asset generation inside conditional blocks that only execute when the results are actually needed for display. Wrap list-item components in `React.memo` and memoize derived list state in the parent to maintain performance as list size grows.
