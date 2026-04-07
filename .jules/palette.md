## 2025-03-24 - [Clear Search Pattern]
**Learning:** Adding a conditional "Clear" button (using an 'X' icon) to search inputs significantly improves usability on touch devices and long queries. It requires careful padding management (e.g., `pr-10`) to prevent text overlap with the absolute-positioned button.
**Action:** Always implement a clear button for search inputs and ensure `aria-label="Clear search"` is present for accessibility.

## 2025-03-24 - [Persona Boundaries]
**Learning:** As the "Palette" agent, fixing unrelated lint errors in backend files (like `build-engine/`) can lead to PR clutter and violates the core mission.
**Action:** Focus exclusively on UI/UX files. If lint errors exist in unrelated files, verify the specific modified UI files using targeted linting (`npx eslint <path>`) instead of broad fixes.
