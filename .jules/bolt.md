## 2025-05-14 - Mutation pitfall with `.sort()`
**Learning:** In JavaScript/TypeScript, `.sort()` mutates the array in place. When generating cache keys or processing data passed as props, this can lead to unexpected side effects in React, such as unintended data changes or unnecessary re-renders.
**Action:** Always create a copy of the array (e.g., using `[...array].sort()`) before sorting if the original array should remain unchanged.
