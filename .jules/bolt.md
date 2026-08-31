## 2025-05-18 - FeedCard Summary Calculation & Memoization

**Learning:** In list views where items compute natural language summaries (`summarizeRepoForBeginners`), passing pre-calculated summary objects to sub-helpers (`getAIContent`) and wrapping item components in `React.memo` with stable handler signatures prevents duplicate NLP regex operations and eliminates unnecessary card re-renders during parent state updates.
**Action:** Always verify sub-helper parameters in list components to reuse computed summaries and pass stable top-level event handlers to maintain `React.memo` validity.
