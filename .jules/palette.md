## 2025-06-02 - Search Field "Clear" Button Pattern
**Learning:** For search inputs with absolutely positioned icons (like a magnifying glass on the left), adding a "Clear" (X) button on the right requires explicit padding (e.g., `pr-9`) to prevent user text from overlapping with the clear icon. Additionally, restoring focus to the input immediately after clearing is a critical micro-interaction for accessibility and keyboard flow.
**Action:** Always use `pr-9` or greater when adding clear buttons to inputs, and use `useRef` to restore focus.

## 2025-06-02 - Navigation Accessibility with `aria-current`
**Learning:** Screen readers depend on `aria-current="page"` to identify the active link in a navigation list. Simply styling the active state is insufficient for a11y.
**Action:** Apply `aria-current="page"` to the active element in Sidebar and MobileNav components.
