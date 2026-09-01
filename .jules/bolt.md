## 2025-05-18 - NewsTicker Render Prep Pre-Computation Optimization
**Learning:** In components rendering multiple responsive variations (such as mobile and desktop views) of the same list items, calculating item metadata (`summarizeRepoForBeginners`, SVG backdrop generation, category labels) inline inside rendering callbacks causes duplicated work per render pass.
**Action:** Wrap card metadata generation in `useMemo` at the component top level to pre-compute card data once per input array change and pass pre-computed metadata objects into render functions.
