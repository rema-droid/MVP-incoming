## 2026-05-29 - Accessible Clearable Search Inputs
**Learning:** When adding an 'X' clear button to a search input, use `pr-9` to `pr-12` padding on the input field to prevent user-typed text from overlapping the button. Returning focus to the input immediately after clearing (`useRef`) ensures optimal keyboard and screen-reader accessibility.
**Action:** Always use `type="button"` for clear buttons within forms to avoid accidental submissions, and ensure a descriptive `aria-label` is present for both the input and the clear button.
