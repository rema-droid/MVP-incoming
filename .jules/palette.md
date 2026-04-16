## 2025-05-14 - [Consistent Search Clearance]
**Learning:** In a navigation-heavy application like GITMURPH, search inputs without clear buttons force redundant keyboard or mouse interactions to reset state. Providing a consistent 'Clear' button across Sidebar, Marketplace, and Mobile views improves flow.
**Action:** Always implement a conditional 'Clear' button (using an 'X' icon, `type="button"`, and `aria-label="Clear search"`) with `focus-visible` ring styles matching the project's design system for all search inputs.
