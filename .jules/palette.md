## 2025-05-14 - Standardized Search Input Pattern
**Learning:** Standardized search inputs in this repository should include a visually hidden label (`sr-only`) linked via specific IDs, a conditional 'Clear' button (`X` icon) with `aria-label="Clear search"`, `focus-visible:ring-blue-500/50`, and increased right padding (e.g., `pr-9`) with `z-10` for button interactivity.
**Action:** Apply this pattern consistently across all search fields to maintain accessibility and a unified user experience.

## 2025-05-14 - Navigation Active States
**Learning:** Active navigation links or buttons in `Sidebar.tsx` and `MobileNav.tsx` must use `aria-current="page"` to explicitly indicate the current active state to assistive technologies, complementing visual indicators like background color changes.
**Action:** Ensure all navigational components include appropriate `aria-current` attributes for better screen reader support.
