## 2025-05-14 - Accessible Clearable Search Inputs
**Learning:** Clear buttons in search inputs improve usability by allowing users to reset their search state instantly. For high-quality UX, these buttons must return focus to the input field using `useRef`, avoid accidental form submissions using `type="button"`, and include `aria-label` for screen readers while hiding the decorative icon with `aria-hidden="true"`.
**Action:** Always implement the `useRef` focus-return pattern and standard ARIA attributes when adding clearable search functionality.
