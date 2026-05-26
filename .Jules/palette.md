## 2025-05-21 - Focus management for "Clear" buttons
**Learning:** When implementing a "Clear" button for a search input, it's critical for accessibility and UX to return focus to the input field immediately after clearing. This prevents focus loss and allows users to quickly start a new search without extra clicks or tab presses.
**Action:** Always use a `useRef` to target the input field and call `.focus()` in the `onClick` handler of the clear button.
