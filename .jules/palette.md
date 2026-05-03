## 2026-05-03 - Standardized Search Input UX Pattern
**Learning:** All search inputs should follow a consistent "Search Input Pattern" to ensure accessibility and ease of use. This includes a visually hidden but screen-reader accessible label, a conditional clear button that appears only when text is present, and specific focus states for keyboard users.
**Action:** Apply the following to all search inputs:
- Use `sr-only` for labels.
- Add a clear button (`X` icon) with `aria-label="Clear search"` and `z-10`.
- Use `pr-10` on the input to avoid text overlap with the clear button.
- Use `focus-visible:ring-blue-500/50` for consistent keyboard accessibility.
