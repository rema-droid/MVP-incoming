# Palette's Journal - Critical UX & Accessibility Learnings

## 2025-08-06 - Focus Visibility & Non-blocking Feedback in Settings
**Learning:** Custom UI controls (like the iOS-style `Toggle` switch built with a hidden checkbox) completely break keyboard accessibility if they do not propagate focus styles to their visible wrappers. Keyboard users are left blind on the page. Similarly, using the default browser `alert()` is highly disruptive and blocky; custom, smooth inline state-based feedback offers a far superior, fluid user experience.
**Action:** Always use tailwind's `peer` state class on `sr-only` inputs coupled with `peer-focus-visible` rings on adjacent container elements to ensure accessible navigation. Replace synchronous `alert()` with reactive, timed inline notifications or custom toasts.
