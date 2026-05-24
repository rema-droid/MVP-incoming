## 2025-05-14 - Clear Search UX Pattern
**Learning:** When implementing a 'Clear Search' button, focus must be returned to the search input field immediately after clearing to ensure a smooth transition for keyboard and assistive technology users. This prevents the focus from being lost or jumping to the top of the page when the button disappears.
**Action:** Always use a React ref to target the search input and call \`.focus()\` in the clear button's click handler.
