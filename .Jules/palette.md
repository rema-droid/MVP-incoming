## 2025-05-22 - Search Input Pattern
**Learning:** All search inputs should provide a clear and accessible way for users to reset their query, especially in complex UIs where search might be persistent across views. Using a standard 'X' icon with proper ARIA labels and focus states ensures both usability and accessibility.
**Action:** Implement the "Search Input Pattern":
1. Visually hidden `<label>` using `sr-only` associated with the input `id`.
2. Conditional 'Clear' button using the `X` icon from `lucide-react`.
3. `aria-label="Clear search"` on the button.
4. Consistent focus-visible ring styles (`focus-visible:ring-blue-500/50`).
5. Absolute positioning (`right-3` or `right-2`) and appropriate right padding on the input to prevent text overlap.
