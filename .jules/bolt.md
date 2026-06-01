## 2025-05-14 - Cache repository summaries
**Learning:** Caching repository summaries using a composite key (title, description, language, sorted topics) significantly reduces redundant computation overhead (regex, string manipulation) in list-heavy views, especially during frequent re-renders or when navigating back and forth.
**Action:** Always consider module-level caching for pure functions that perform expensive text processing on repository metadata, ensuring cache keys are stable by sorting array inputs like topics.
