## 2025-05-15 - [Search Input Pattern]
**Learning:** All search inputs (Sidebar, Marketplace, Mobile) should provide a conditional 'Clear' button to improve usability and allow users to quickly reset their search context.
**Action:** Implement a conditional 'X' icon button (`type="button"`, `aria-label="Clear search"`) when search text is present. Increase input right padding (e.g., `pr-10`) to prevent text overlap and use high-contrast `focus-visible:ring-blue-500/50` for accessibility.
