# Bolt's Journal

## 2026-04-01 - React layout rendering cascades from polling and typing
**Learning:** In a highly interactive UI with frequent background state updates (such as polling run job queues every 2 seconds) and rapid keyboard inputs (such as search fields updating parent states), the entire React component tree re-renders continuously. Without memoization, children components (such as list items/cards) re-execute heavy computations, such as SVG rendering and regular expression replacements (over 75 elements), blocking the main thread and resulting in layout rendering cascades.
**Action:** Always wrap heavy list/grid child components (like `RepoCard` and `FeedCard`) in `React.memo`, utilize `useMemo` for any complex markup, SVG generation or natural language parser calculations within children, and stabilize all callback prop references in the parent using `useCallback` to prevent continuous layout rendering cascades.
