## 2025-05-15 - [Clear Search Button Patterns]
**Learning:** Adding a 'Clear Search' button (X icon) requires two critical UX considerations: 1) Returning focus to the input field immediately after clearing for keyboard/screen-reader continuity, and 2) Increasing the input's right padding (e.g., `pr-9`) to prevent text from overlapping the absolutely positioned clear button.
**Action:** Always use `useRef` to manage focus and ensure CSS padding accounts for the button width in clearable inputs.
