# Palette's Journal

## 2025-05-14 - Search Input UX Pattern
**Learning:** In applications with data-heavy views (Sidebar, Marketplace), providing a quick way to clear search results via an 'X' button significantly improves user flow, especially on touch devices where manual deletion is cumbersome. However, absolute-positioned 'Clear' buttons can overlap search text if the input padding is not explicitly adjusted (e.g., using `pr-10`).
**Action:** Always pair absolute-positioned input icons/buttons with corresponding horizontal padding on the input field to prevent visual overlap.
