## 2025-05-21 - [Clear Search Pattern]
**Learning:** When implementing a 'Clear Search' button, focus must be returned to the search input field immediately after clearing to ensure a smooth transition for keyboard and assistive technology users.
**Action:** Use a `ref` on the input element and call `.focus()` in the clear button's `onClick` handler.
