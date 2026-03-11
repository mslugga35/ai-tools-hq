# Dead Code Cleanup — 2026-03-11

CodeLens flagged 14 items. After grepping all `.astro`, `.ts`, `.js`, and `.mjs` files (including Astro frontmatter blocks), here is the full verdict.

---

## DELETED (3 items)

All three were exported functions in `site/src/lib/supabase.ts` with zero callers across the entire codebase.

| # | Symbol | File | Lines removed | Reason |
|---|--------|------|---------------|--------|
| 11 | `getToolBySlug` | `site/src/lib/supabase.ts:152` | 152–156 | No callers. Only mention was a CLAUDE.md gotcha note (also removed). Astro pages use `getAllTools()` + array filter instead. |
| 12 | `getToolsByCategory` | `site/src/lib/supabase.ts:164` | 164–167 | No callers. Category pages use `getAllTools()` + `groupByCategory()` instead. |
| 13 | `getAllSlugs` | `site/src/lib/supabase.ts:187` | 187–190 | No callers. Static paths use `getAllTools()` and map slugs inline. |

---

## KEPT — FALSE POSITIVES or LIVE CODE (11 items)

| # | Symbol | File | Verdict | Evidence |
|---|--------|------|---------|----------|
| 1 | `prerender` | `sitemap.xml.ts:7` | FALSE POSITIVE | Astro SSG convention — required for static output of this endpoint |
| 2 | `GET` | `sitemap.xml.ts:9` | FALSE POSITIVE | Astro API route convention — the HTTP handler for the sitemap |
| 3 | `getStaggeredDate` | `seo-utils.ts:33` | ALIVE | Used in `tools/[slug].astro:42`, `compare/[...slugs].astro:27`, `alternatives/[slug].astro:23` |
| 4 | `splitBullets` | `seo-utils.ts:100` | ALIVE | Used in `tools/[slug].astro:25-26`, `compare/[...slugs].astro:22-25`, `alternatives/[slug].astro:24` |
| 5 | `escapeHtml` | `seo-utils.ts:112` | ALIVE | Used in `tools/[slug].astro:33,37`, `alternatives/[slug].astro:5` (admin.astro has its own local copy — separate, not imported) |
| 6 | `INDEXED_COMPARISONS` | `seo-utils.ts:134` | ALIVE | Used internally by `isIndexedComparison()` on line 176 of the same file |
| 7 | `safeJsonLd` | `seo-utils.ts:179` | ALIVE | Used in `tools/[slug].astro`, `alternatives/[slug].astro`, `components/Schema.astro`, `layouts/BlogPost.astro` |
| 8 | `PricingKey` | `seo-utils.ts:187` | ALIVE | Used as a type in `components/PricingFilter.astro:7` |
| 9 | `PricingInfo` | `seo-utils.ts:189` | ALIVE | Used as return type inside `seo-utils.ts` itself; required for `classifyPricing` signature |
| 10 | `classifyPricing` | `seo-utils.ts:210` | ALIVE | Used in `components/ToolCard.astro:40`, `pages/category/[category].astro:111`, `pages/tools/index.astro:41` |
| 14 | `devices` (import) | `playwright.config.ts:1` | FALSE POSITIVE | Used on line 18: `use: { ...devices['Desktop Chrome'] }` |

---

## Files Modified

- `site/src/lib/supabase.ts` — removed 3 exported functions (35 lines net reduction)
- `CLAUDE.md` — removed stale gotcha note about `getToolBySlug`
