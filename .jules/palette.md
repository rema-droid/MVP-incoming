## 2025-05-14 - Clearable Search and Nav Accessibility
**Learning:** Adding a clear button to search inputs significantly improves UX by allowing users to quickly reset their search state, especially on mobile. Focus management (returning focus to the input) is crucial for a seamless experience and accessibility. Using `aria-current="page"` is a simple but effective way to communicate the active navigation state to assistive technologies.
**Action:** Always implement focus-restoring clear buttons for search inputs and use appropriate ARIA attributes like `aria-current` for navigation menus.
