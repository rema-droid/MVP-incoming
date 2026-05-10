## 2025-05-15 - Search Input Accessibility & Utility
**Learning:** Standardizing search inputs with visually hidden labels and "clear" buttons improves both screen reader compatibility and general UX. In compact layouts like sidebars, absolute positioning of the clear button requires increasing the input's right padding (e.g., `pr-10`) to prevent text overlap and ensure interactivity.
**Action:** Always include an `sr-only` label linked via `id`/`htmlFor` and a conditional clear button (with `z-10`) for all search inputs.
