## 2025-05-15 - Clearable Search Inputs & Navigation A11y

**Learning:** Implementation of clearable search inputs requires a trifecta of UX touches: absolute positioning for the button, sufficient right-padding on the input to prevent text overlap, and programmatic focus restoration (via `useRef`) to maintain the user's flow. Additionally, using `aria-current="page"` on active navigation tabs is essential for screen reader context.

**Action:** When adding search inputs, always include a clear button with `type="button"` (to avoid form triggers), `aria-label="Clear search"`, and an `aria-hidden="true"` icon. Ensure the input has `pr-9` or `pr-10` and use a ref to focus back on the input after clearing.
