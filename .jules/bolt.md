## 2025-05-14 - Composite Key Memoization for Repo Summaries
**Learning:** Complex string processing and regex matching in repository summary functions create a significant performance bottleneck during large list renders. Composite keys (joining title, description, language, and topics) provide a stable cache key for memoization.
**Action:** Use `Map` caches with size limits for all pure functions that transform repository metadata into UI strings.

## 2025-05-14 - PR Scope Management
**Learning:** Combining multiple optimizations (constant hoisting, logic memoization, UI caching) into a single PR can easily exceed the 50-line limit and increase review complexity.
**Action:** Prioritize a single, high-impact optimization per PR to ensure faster reviews and adherence to repository constraints.
