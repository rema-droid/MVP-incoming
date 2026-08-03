# Palette Journal

## 2026-04-01 - Keyboard Focus and Accessibility Rings on Custom Toggles
**Learning:** Hidden checkbox inputs (`sr-only`) used for custom Toggle switches completely disable keyboard focus visibility unless `peer` and `peer-focus-visible` rings are explicitly configured on the adjacent visual track/slider element.
**Action:** Always pair `sr-only` styled checkbox elements with `peer` and apply focus-visible ring styles (e.g., `peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500`) to the adjacent structural wrapper elements to maintain keyboard navigation focus.
