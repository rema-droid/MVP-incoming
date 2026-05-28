## 2025-05-28 - Search Input Clear Button Pattern
**Learning:** For search inputs in this application's dense UI, adding an absolute-positioned 'X' button requires increasing the input's right padding from `pr-3`/`pr-4` to `pr-9` to prevent text overlap. Immediate focus restoration via `useRef` is critical for maintaining context in the heavily filtered list views.
**Action:** Use `pr-9` and `useRef.current?.focus()` when implementing clearable inputs in Sidebar or main feed forms.
