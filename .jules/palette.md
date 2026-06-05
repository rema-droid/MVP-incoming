## 2025-05-14 - [Clearable Search Pattern]
**Learning:** Adding a clear button to search inputs significantly improves interaction speed for users. Using `useRef` to restore focus to the input after clearing is a critical accessibility detail that prevents focus loss. Additionally, increasing right padding (e.g., `pr-9`) is necessary to prevent text overlap.
**Action:** Always implement `useRef` focus restoration and adequate padding when adding clear buttons to inputs.

## 2025-05-14 - [Navigation Active State Accessibility]
**Learning:** Visual active states (like background changes) are not sufficient for screen readers. Using `aria-current="page"` provides the necessary semantic context for non-visual users.
**Action:** Apply `aria-current="page"` to all active navigation items in both sidebar and mobile navigation menus.
