## 2025-05-15 - Trending API Latency
**Learning:** The `discover` category in `/api/trending/route.ts` takes ~10s due to multiple sequential (though batched via Promise.all) GitHub API calls hitting unauthenticated rate limits or network overhead.
**Action:** Implement bounded in-memory caching (FIFO) with a 5-minute TTL to reduce warm latency to ~30ms.
