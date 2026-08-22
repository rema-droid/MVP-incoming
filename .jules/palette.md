## 2025-05-18 - Full-Screen Modal Keyboard Dismissal & Maker Links
**Learning:** Full-screen detail overlay views like `RepoDetails` lacked `Escape` keyboard dismissal and contained non-interactive informational cards.
**Action:** Always attach an `Escape` key listener in a `useEffect` for detail views/modals and ensure maker/action cards have functional `onClick` handlers, `aria-label` attributes, and `focus-visible` ring indicators.
