## 2025-05-15 - Multi-Context Search & Navigation Accessibility
**Learning:** In a responsive Next.js application with multiple views (Sidebar, Marketplace, Mobile), search inputs often lack a consistent "Clear" mechanism, and navigation elements frequently miss 'aria-current' to indicate state to screen readers.
**Action:** Standardize on a 'useRef' based focus management for clearable search inputs and ensure 'aria-current="page"' is applied to active navigation links across all layout variations (sidebar and bottom nav).
