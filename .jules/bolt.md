# Bolt's Journal - Critical Learnings

## 2026-08-07 - Optimizing heavy inline metadata and regex structures
**Learning:** Reconstructing massive arrays of regular expressions (e.g., 75 items inside `simplifyWords`) on every call creates substantial garbage collection and compilation overhead. Furthermore, performing visual-only backdrop calculations (like SVG assembly with `encodeURIComponent`) at the component-root level for list cards that do not display them degrades overall list rendering speed.

**Action:** Always hoist static pattern lists or RegEx objects to module scope to ensure they are compiled exactly once. In React/Next components, postpone heavy styling, palette extraction, or SVG assets calculations to the specific conditional blocks/variants where they are actually rendered.
