## 2025-05-14 - Accessible Clearable Search Inputs
**Learning:** In a multi-view application with several search inputs (sidebar, mobile, marketplace), a consistent "Clear Search" pattern using `useRef` for focus restoration significantly improves UX for both mouse and keyboard users. Providing unique `aria-label` attributes for each input (e.g., "Search repositories" vs "Search marketplace") helps screen reader users understand the scope of the search.
**Action:** Always implement `useRef` to refocus the search input after clearing, and use explicit `aria-label` for buttons and inputs.
