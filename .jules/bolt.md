## 2025-06-22 - [Hoisting regexes and constants in repoSummary]
**Learning:** In string-processing-heavy modules like `src/lib/repoSummary.ts`, creating RegExps and large arrays (like the ~75-item jargon `swaps`) inside functions leads to significant redundant allocation and compilation overhead. Hoisting these to the module level provides a measurable speedup (~11.5% in this case) and reduces GC pressure.
**Action:** Always check high-frequency string processing functions for inline RegExp literals and static data structures that can be hoisted.
