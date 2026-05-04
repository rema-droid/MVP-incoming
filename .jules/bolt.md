## 2025-05-14 - Optimized Repository Summary and Search UI
**Learning:** Frequent regex recreation and unnecessary re-renders of list items during search input significantly degrade UI responsiveness.
**Action:** Move regex-based transformations to module-level constants and use React.memo, useMemo, and useCallback to stabilize component rendering.
