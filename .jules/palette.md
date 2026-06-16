## 2025-05-14 - Accessible Search & Navigation Patterns
**Learning:** In this design system, search inputs were missing a "Clear" functionality, which is a common micro-interaction expectation. Additionally, active navigation states were visually indicated but not semantically communicated to screen readers.
**Action:** Always implement a "Clear" button for search inputs that:
1. Only appears when the input is not empty.
2. Uses `aria-label="Clear search"` for accessibility.
3. Uses `useRef` to explicitly return focus to the input after clearing.
For navigation, always use `aria-current="page"` on the active link or button to ensure screen reader users understand their current location.
