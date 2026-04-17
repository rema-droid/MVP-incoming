## 2025-05-14 - Immutable Cache Key Generation
**Learning:** Utility functions generating cache keys from shared objects must avoid in-place mutations (like `array.sort()`). Mutating input data in a background performance utility can cause hard-to-debug UI regressions or inconsistent state across the application.
**Action:** Always use spread syntax or other non-mutating methods (e.g., `[...topics].sort()`) when processing data for keys or intermediate calculations.
