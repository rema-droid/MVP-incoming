## 2025-05-14 - Standardizing Search and Icon Accessibility

**Learning:** Search inputs with absolute-positioned 'Clear' buttons require specific right padding (e.g., `pr-10`) to prevent text overlap with the action icon. Additionally, icon-only buttons in the feed and details view (Like, Share, Close) were missing ARIA labels, making them unusable for screen readers.

**Action:** Always use `pr-9` or `pr-10` for search inputs with clear buttons. Consistently apply `aria-label` and `focus-visible:ring-2` to all icon-only buttons to meet accessibility standards.
