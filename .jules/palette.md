## 2026-04-18 - Consistent Search & Navigation Accessibility
**Learning:** Combining "Clear Search" functionality with high-contrast keyboard focus indicators (`focus-visible`) and semantic ARIA attributes (`aria-current`) significantly improves both the "delight" factor and standard accessibility for power users and assistive technologies.
**Action:** Always include a conditional 'X' button in search inputs and ensure navigation items use `aria-current="page"` with a `focus-visible` ring of at least `50%` opacity for clear visibility.
