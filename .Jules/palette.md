## 2026-05-27 - Focus Management in Clear Search

**Learning:** When implementing a "Clear Search" button inside a search input, accessibility is compromised if the focus is lost after clearing. Returning focus to the input field allows users (especially those using keyboard navigation or screen readers) to immediately refine their search without additional navigation.

**Action:** Always use a `useRef` to target the search input and call `.focus()` after clearing the search state.
