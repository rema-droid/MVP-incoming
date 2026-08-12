# Palette's Journal

## 2025-08-12 - Inline Self-Reverting Success States for Settings History
**Learning:** Browser-native alerts disrupt the user flow and feel unpolished in modern web application settings panels. When global toast notifications are absent, replacing browser-native alerts with inline self-reverting success states (with subtle colors, clear checkmarks, and brief disabled state) provides a highly pleasant and non-intrusive micro-UX that fits organically.
**Action:** Always avoid `alert()` popups in settings. Instead, handle user actions with self-reverting success states directly on the button/trigger itself (with a 2-second timeout).
