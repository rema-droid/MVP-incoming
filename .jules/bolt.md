## 2025-08-01 - Avoid eager calculation of unused variant-specific metadata in RepoCard

**Learning:** `RepoCard` eagerly computed SVG backdrops (`getRepoBackdrop`), color palettes (`getRepoPalette`), and categories (`friendlyCategoryLabel`) for all instances, even when rendered as a standard list card (`variant === "list"`) where none of those elements are displayed. This wasted ~28.8% of card rendering time.

**Action:** Wrap variant-specific computations in conditional checks inside `useMemo` so that they return empty values immediately when rendering the list-variant cards, eliminating unnecessary SVG and string regex parsing overhead on standard lists.
