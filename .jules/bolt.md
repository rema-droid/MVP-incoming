## 2025-05-18 - Defer heavy metadata operations on `RepoCard` list-rendering
**Learning:** Eager evaluation of heavy layout and design functions (SVG generation, category parsing, color palette lookup) inside frequently rendered components like `RepoCard` creates unnecessary CPU and memory allocation overhead.
**Action:** Move expensive layout/metadata computations (e.g., `getRepoBackdrop`, `getRepoPalette`, `friendlyCategoryLabel`) inside conditional blocks (such as `variant === "widget"`) so that they are only evaluated when actually required by the specific layout variant.
