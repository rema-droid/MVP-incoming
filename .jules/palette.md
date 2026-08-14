# Palette Agent Journal

This journal tracks critical UX and accessibility learnings, patterns, and decisions made for GITMURPH.

## 2025-08-14 - Inline Reverting Success States vs. Browser Alerts
**Learning:** Replaced a disruptive, browser-native alert popup for data deletion/history clearing with an elegant, state-driven, self-reverting success state on the trigger button itself. This preserves the user's flow and attention without blocking interaction. Additionally, styling the custom hidden inputs (checkboxes) using `peer-focus-visible` with wrapper focus rings provides a clear, seamless navigation path for keyboard/screen-reader users without custom CSS hacking.
**Action:** Always replace standard `alert()` popups with inline, disabled-layout success checkmarks or micro-banners. Ensure custom Toggle components have `peer-focus-visible` ring triggers to satisfy high-contrast accessibility standards.
