## 2025-05-18 - NewsTicker Duplicate Render Pass Memoization
**Learning:** Components rendering dual viewport views (e.g. mobile vs desktop layouts) from the same props often re-run identical heavy calculations (`summarizeRepoForBeginners`, `getRepoBackdrop`, `friendlyCategoryLabel`) for each layout pass.
**Action:** Use `useMemo` at the top level of the component to pre-compute card metadata into a structured array, then slice/map that array across viewport layouts to eliminate redundant computations.
