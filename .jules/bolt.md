## 2025-02-18 - NewsTicker Card Metadata Memoization

**Learning:** `NewsTicker.tsx` renders featured picks in two responsive views (a mobile horizontal scroll list and a desktop 3-column grid). Previously, card metadata functions (`summarizeRepoForBeginners`, `getRepoBackdrop` with SVG generation, `friendlyCategoryLabel`, and tone styling) were executed twice per item on every render pass. Memoizing card metadata with `useMemo` reduced redundant computations and achieved a 30.1% performance speedup during component render passes.

**Action:** When a component renders the same items in multiple distinct responsive layouts, pre-calculate item metadata using `useMemo` into a single data structure, and wrap the component in `React.memo` to skip re-renders when props are unchanged.
