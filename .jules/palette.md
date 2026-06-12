## 2025-05-15 - Clearable Search with Focus Management
**Learning:** For apps with multiple entry points for search (e.g., sidebar and mobile header), providing a consistent "clear" interaction with immediate focus restoration ensures parity across devices and maintains keyboard flow.
**Action:** Always implement a clear button ('X' icon) for search inputs when text is present, and use `useRef` to programmatically restore focus to the input field after clearing.
