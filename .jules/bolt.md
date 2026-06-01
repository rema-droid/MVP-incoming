## 2025-05-15 - Optimizing list rendering in RepoCard

**Learning:** In multi-variant components used in large lists (like `RepoCard.tsx`), isolate expensive asset generation (e.g., SVG string concatenation or palette lookups) within conditional blocks specific to the variant that needs them. This prevents unnecessary overhead for the majority of list items that use a lighter variant.

**Action:** Always check if computed properties in list-heavy components are used by all variants, and defer computation to the specific variant block if possible.
