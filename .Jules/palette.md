## 2025-05-14 - Search Focus Recovery pattern
**Learning:** When adding a 'Clear search' button to an input field, users expect focus to remain in the input so they can immediately type a new query. Without manual refocusing, focus is often lost or moves to the next interactive element.
**Action:** Use a React `useRef` to programmatically call `.focus()` on the input element within the clear button's click handler.

## 2025-05-14 - Icon-only Button Accessibility
**Learning:** The app uses several high-impact icon-only buttons (Share, Like, Close) in the Feed and Story views that lack text descriptions, making them inaccessible to screen readers.
**Action:** Always provide descriptive `aria-label` attributes for Lucide-based icon buttons in interactive components like `FeedCard` and `StoryOverlay`.
