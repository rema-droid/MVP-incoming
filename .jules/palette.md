## 2025-05-22 - [Clear Search Pattern]
**Learning:** Clear-search buttons ('X' icons) in search inputs should be absolutely positioned and only visible when a query exists. Using `useRef` to restore focus to the input immediately after clearing ensures optimal keyboard and screen-reader accessibility.
**Action:** When adding a clear button to a search input, use `useRef` for focus management and ensure `aria-label="Clear search"` is present.

## 2025-05-22 - [Responsive UI Selection in Testing]
**Learning:** When selecting elements in a responsive Tailwind layout (e.g., searching for inputs in both Sidebar and Mobile view), Playwright selectors should use contextual parents like `aside input` or `main input` to differentiate between visible and hidden elements sharing the same attributes.
**Action:** Use contextual locators in Playwright scripts when multiple instances of a component exist for different breakpoints.
