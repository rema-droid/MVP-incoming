## 2026-06-18 - Clearable Search Input Pattern
**Learning:** Adding a clear button to search inputs significantly improves UX for repetitive searching. Proper implementation requires absolute positioning, increased right padding on the input to avoid text overlap, and explicit focus management using refs to maintain keyboard context.
**Action:** Use a consistent `pr-9` or `pr-10` padding on search inputs with an absolutely positioned `X` icon (h-4 w-4) and return focus to the input after clearing.
