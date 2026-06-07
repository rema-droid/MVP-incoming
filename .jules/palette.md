## 2025-05-15 - Clearable Search Inputs
**Learning:** Adding a clear button to search inputs significantly improves UX by allowing one-click resets, but it requires careful focus management and layout considerations. Using `useRef` to restore focus to the input field after clearing ensures that keyboard and screen reader users aren't left in a disconnected state.
**Action:** When implementing clearable inputs, always use `useRef` for focus restoration and ensure the input has adequate right padding (e.g., `pr-9`) to prevent text from overlapping the absolutely positioned clear button.
