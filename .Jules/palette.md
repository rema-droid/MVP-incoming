## 2025-05-14 - Standardizing Search Input Accessibility and Usability
**Learning:** In a multi-view application (Sidebar, Marketplace, Mobile), inconsistent search patterns lead to degraded UX. Missing `<label>` elements on search inputs significantly impact screen reader accessibility, even when placeholders are present.
**Action:** Always implement search inputs with a visually hidden `<label>` (using `sr-only`) and a conditional "Clear search" button using the `X` icon from `lucide-react` with a descriptive `aria-label`. Ensure right padding is increased to accommodate the clear button.
