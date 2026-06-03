## 2025-05-15 - Optimizing RepoCard rendering and utility functions

**Learning:** The `summarizeRepoForBeginners` function performs multiple regex replacements and string manipulations, taking ~0.05ms per call. While small, this adds up when rendering lists of 50+ repositories, especially when triggered by rapid state changes like search input. Furthermore, the main `Home` component lacked memoization for event handlers and complex groupings, leading to full tree re-renders on every keystroke.

**Action:**
1. Implement a Map-based cache in `src/lib/repoSummary.ts` for `summarizeRepoForBeginners` to avoid redundant processing of the same repository data.
2. Use `React.memo` for `RepoCard` to prevent re-renders when parent state unrelated to the card changes.
3. Stabilize handler references using `useCallback` and memoize grouped data using `useMemo` in `src/app/page.tsx`.
