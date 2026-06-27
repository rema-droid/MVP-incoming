## 2025-06-27 - Clear Search + Focus Management Pattern
**Learning:** Adding a clear search button significantly improves the experience of exploring repositories, but it must be paired with programmatic focus management. Simply clearing the value without returning focus to the input forces keyboard users to re-navigate to the input, breaking the "flow" of searching.
**Action:** Always use `useRef` to maintain focus on search inputs when implementing clear or reset functionality.
