## 2025-05-15 - [Aria-current and search focus]
**Learning:** Using `aria-current="page"` on active navigation items significantly improves the semantic experience for screen reader users by explicitly marking the current location within a set of links. For search inputs, providing a clear button is a micro-UX win, but it must always restore focus to the input field using `useRef` to maintain a seamless keyboard flow.
**Action:** Always include `aria-current` on active navigation and ensure interactive elements like "Clear" buttons return focus to their logical parent or origin.
