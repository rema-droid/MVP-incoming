## 2025-05-22 - Search Focus Management
**Learning:** When implementing a 'Clear Search' button, focus must be returned to the search input field immediately after clearing to ensure a smooth transition for keyboard and assistive technology users. Without this, the focus might be lost or reset to the top of the page, disrupting the user's flow.
**Action:** Always use a ref to the input element and call `.focus()` in the clear button's `onClick` handler.
