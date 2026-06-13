## 2026-06-13 - Clearable Search Inputs
**Learning:** Users often expect a quick way to reset search queries. Implementing a clear button ('X') with proper focus restoration (using 'useRef') and accessibility ('aria-label') significantly improves the search experience.
**Action:** Always include a clear-search button in search inputs, ensure 'pr-9' or similar padding to avoid text overlap, and restore focus to the input after clearing.
