# Palette's Journal - Critical Learnings Only

## 2025-07-30 - Interactive Delight in Modal Story Overlays
**Learning:** Adding local interactive state (like an instant heart/like toggle with custom scale/rose styling) inside a modal story overlay transforms a static visual viewer into an engaging, platform-native experience. When users encounter icons commonly associated with interactive feeds, they expect instant visual feedback. Adding dynamic ARIA labels (e.g. `Unlike story` vs `Like story`) ensures this interactive delight is fully shared by screen reader users.
**Action:** Always map social/interactive icons (Hearts, Shares, Saves) in overlays or preview cards to active, responsive UI feedback states and ensure they are annotated with correct semantic aria-labels.
