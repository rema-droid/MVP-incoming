## 2025-05-14 - Clearable Search and Navigation Accessibility
**Learning:** This application implements search inputs separately for desktop (in Sidebar.tsx) and mobile (inline in page.tsx), requiring dual implementation for consistent UX. Navigation components lacked `aria-current` attributes, a critical accessibility gap for screen readers in single-page navigation.
**Action:** Always check both Sidebar and the main page.tsx for responsive-specific UI components. Implement `aria-current="page"` on all active navigation links/buttons by default.
