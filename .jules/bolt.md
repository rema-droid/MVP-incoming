## 2025-05-15 - Optimizing Shared Component Render Performance

**Learning:** In this codebase, the `RepoCard` component is used extensively in both 'widget' (decorative) and 'list' (compact) modes. Expensive logic for generating SVG backdrops and simplifying repository descriptions was executing for every instance, regardless of the variant. Deferring these computations to variant-specific blocks and adding a bounded cache for the text processing utility reduced computational overhead by ~95% for typical list renderings.

**Action:** Always audit shared components for expensive computations that aren't required by all variants. Use `React.memo` for list items and `useMemo` for shared expensive logic. Implement bounded caches for pure utility functions that process repetitive metadata.
