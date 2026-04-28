## 2025-05-14 - Standardizing Search Input UX
**Learning:** In highly compact layouts like sidebars, adding interactive elements like "Clear search" buttons requires careful management of padding (`pr-10`) and stacking context (`z-10`). Without these, the button may either overlap input text or become uninteractable due to the input field's background/border layers in specific CSS frameworks.
**Action:** Always ensure absolute-positioned icons in inputs have a higher z-index than the input field and that the input field provides enough right-padding to prevent text overlap.
