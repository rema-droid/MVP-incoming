# Palette Journal

## 2025-05-15 - Search Usability and Accessibility
**Learning:** Implementing a "Clear Search" button requires three critical considerations for a smooth UX:
1. **Focus Management:** Users expect focus to return to the search input after clearing. Without this, they must manually click or tab back, breaking the flow.
2. **Visual Space:** Adding an icon button inside an input field requires increasing the `padding-right` of the input to ensure text doesn't underlap the button.
3. **Recovery Paths:** When search results are empty, providing an explicit "Clear search" action in the empty state (besides the icon in the input) offers a more discoverable recovery path for users.

**Action:** Always use `useRef` to manage focus when implementing clearable inputs and ensure input padding accommodates internal action buttons.
