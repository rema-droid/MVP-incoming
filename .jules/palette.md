## 2025-05-15 - Conditional Clear Buttons for Search Inputs
**Learning:** Adding a clear button ('X') to search inputs significantly improves usability, especially on touch devices or when users want to quickly reset filters. It's important to increase the right padding of the input to prevent text overlap with the absolutely positioned button.
**Action:** Always implement a conditional clear button for search inputs in this design system, using the 'X' icon from lucide-react, type="button", and a descriptive aria-label. Use pr-9 or pr-10 for padding depending on the button size/position.
