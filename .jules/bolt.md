## 2025-05-18 - Optimized MarketplaceView Sorting & Categorization

**Learning:** In MarketplaceView, sorting items by price previously recalculated formatted price strings and parsed them with `parseFloat(price.replace("$", ""))` on every array comparison, while repository categorization created fresh arrays per keyword group per repo.

**Action:** Hoist category keyword lookups outside function scope, use direct numeric lookup helpers for price sorting, and wrap card components in `React.memo`.
