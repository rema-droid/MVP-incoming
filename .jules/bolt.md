## 2026-06-21 - Hoisting static constants and regexes in repoSummary
**Learning:** Hoisting large arrays (like the ~75-item SWAPS array) and regular expression literals out of frequently called functions can provide significant performance gains (~30% in this case) in Next.js/React applications by reducing allocation overhead and regex compilation time.
**Action:** Always check for static data or regex literals inside high-frequency utility functions and move them to module-level constants.
