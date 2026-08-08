# Palette's Journal - GITMURPH

This journal is for recording critical UX/accessibility learnings during our development of GITMURPH.

## 2025-08-08 - Sidebar Search Reset and Keyboard Focus Restoration
**Learning:** In highly interactive single-page interfaces with responsive layouts (like sidebar search navigation), adding interactive actions (such as clear buttons) can easily disrupt the accessibility focus flow if they disappear upon click. Restoring programmatic focus to the associated input container via React `useRef` guarantees screen-reader continuity and keyboard navigability.
**Action:** Always pair client-side input clearing controls with active element refocusing and distinct descriptive ARIA labels (`aria-label`) to preserve keyboard focus paths.
