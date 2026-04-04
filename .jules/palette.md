# Palette's Journal - Critical Learnings Only

## 2025-05-14 - Search Input UX Pattern
**Learning:** In highly visual/mobile-first layouts, a "Clear Search" button is essential to allow users to quickly reset their state without manual deletion, which can be cumbersome on touch devices. Positioning this button inside the input field (absolute positioning) maintains visual hierarchy while providing immediate utility.
**Action:** Always check search inputs for a clear action, especially if they control core navigation views like Marketplace or Sidebars. Use conditional rendering based on the presence of text to keep the UI clean.

## 2025-05-14 - Accessibility for Icon-Only Interaction
**Learning:** Icon-only buttons (Heart, Share, Close) are common in "Feed" style layouts but are invisible to screen readers without explicit ARIA labels. Adding these labels is a high-impact, low-effort micro-UX win that significantly improves accessibility without changing the visual design.
**Action:** Audit feed cards and detail modals for icon-only buttons and ensure `aria-label` is present.
