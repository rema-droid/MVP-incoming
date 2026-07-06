## 2025-05-14 - Search Focus Management
**Learning:** When adding a 'Clear search' button to an input, it is critical to programmatically refocus the input field after clearing. This prevents keyboard users and screen reader users from losing their context within the form and ensures a smooth "clear and try again" loop.
**Action:** Use a `useRef` hook to reference the search input and call `.focus()` immediately after clearing the search state.

## 2025-05-14 - Accessibility for Icon-only Engagement Buttons
**Learning:** Engagement buttons (Like, Share, Comment) in feed-style components are often icon-only and lack descriptive text. Without `aria-label`, these buttons are completely opaque to screen reader users, who will only hear "button".
**Action:** Always provide descriptive `aria-label` attributes for icon-only buttons. For toggleable buttons like 'Like', ensure the label updates based on the state (e.g., "Like" vs "Unlike").
