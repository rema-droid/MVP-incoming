## 2025-05-14 - Standardizing Search and Navigation Accessibility
**Learning:** In a multi-view application (sidebar, mobile, marketplace), search inputs should consistently provide a "Clear" button and visually hidden but screen-reader-accessible labels. Navigation items should use `aria-current="page"` to indicate the active view.
**Action:** Always implement a `Clear` button and `sr-only` label for search inputs, and ensure navigation links indicate their active state via `aria-current`.
