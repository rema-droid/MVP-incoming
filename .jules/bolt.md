## 2025-05-15 - Lazy-evaluate heavy metadata computations in list item renders
**Learning:** Top-level computations for complex visuals (like SVG generation, theme palette loading, category labeling) inside frequently rendered list components (like `RepoCard`) cause massive frame rate drops and rendering overhead even if those fields are unused in standard list items.
**Action:** Always wrap heavy layout/visual generation code in conditionals or lazy-evaluate them only inside the specific block that renders the rich variant.
