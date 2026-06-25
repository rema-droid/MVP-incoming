## 2025-05-14 - Clearable Search Input Pattern
**Learning:** For a better UX in search-heavy interfaces, clear buttons should not only reset the state but also explicitly return focus to the input field using `useRef` to maintain keyboard accessibility and allow immediate refined searches.
**Action:** Always implement `searchInputRef.current?.focus()` in the `onClick` handler of clear buttons for search inputs.

## 2025-05-14 - Navigation Accessibility with aria-current
**Learning:** Screen readers need semantic cues to identify the active page in navigation menus. Standardizing on `aria-current="page"` for active buttons/links in sidebars and bottom navigation bars improves navigation context for assistive technology users.
**Action:** Apply `aria-current={isActive ? "page" : undefined}` to all main navigation elements.
