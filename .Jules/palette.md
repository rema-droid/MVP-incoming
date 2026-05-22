## 2026-05-22 - Search Focus Management
**Learning:** When adding a 'Clear Search' button that conditionally renders, the user's focus is lost if the button is removed from the DOM. Returning focus to the input field using a `ref` is essential for maintaining a seamless experience, especially for keyboard and screen reader users.
**Action:** Always use a `useRef` hook to explicitly return focus to the associated input field after a clearing action.
