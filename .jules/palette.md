## 2025-05-14 - Search Input Pattern
**Learning:** All search inputs (Sidebar, Marketplace, Mobile) provide a conditional 'Clear' button (using an 'X' icon, `type="button"`, and `aria-label="Clear search"`). This requires increasing input right padding (e.g., `pr-10`) to prevent text overlap and high-contrast `focus-visible:ring-blue-500/50` for accessibility.
**Action:** Always implement the 'Clear' button pattern for search inputs to improve usability for mouse users and ensure high-contrast focus states for keyboard users.
