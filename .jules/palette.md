## 2025-05-14 - Clear Search Focus Management
**Learning:** When implementing a "Clear Search" button inside an input field, it is crucial for accessibility and user flow to return focus to the input element immediately after the clear action. This prevents the focus from being lost or jumping to the top of the page, allowing the user to continue typing or searching without manual re-focusing.
**Action:** Always use a `useRef` to target the search input and call `.focus()` in the clear button's `onClick` handler.
