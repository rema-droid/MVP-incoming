## 2025-05-15 - Redundant computations in list rendering
**Learning:** React components in large lists often execute expensive logic (regex, SVG generation) even when that logic is only needed for a specific variant (e.g., 'widget' vs 'list').
**Action:** Always defer expensive computations behind variant-specific conditionals and use memoization (React.memo, Map-based caches) for pure string processing to minimize main thread blocking during list renders.
