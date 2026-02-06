# site/src/lib — Shared Utilities

## Architecture

- **Framework:** Astro (static site generation)
- **Data:** Supabase PostgreSQL via REST API
- **Hosting:** Vercel (static deploy)
- **Pages:** ~711 (tool reviews, comparison pages, category pages, best-of lists)

## Modules

### supabase.ts

Data layer for the tools catalog. Fetches from Supabase REST API.

| Export | Description |
|--------|-------------|
| `Tool` | TypeScript interface for tool records |
| `getAllTools()` | All published tools (generated=true) |
| `getToolBySlug(slug)` | Single tool lookup |
| `getToolsByCategory(cat)` | Tools filtered by category |
| `getCategories()` | Unique category names |
| `getAllSlugs()` | All slugs (for static path generation) |

**Security:** Uses the Supabase anon key (public, read-only). RLS is enabled server-side. The key is safe to expose in client code.

### seo-utils.ts

Shared helpers for SEO schema markup and content formatting.

| Export | Description |
|--------|-------------|
| `slugHash(str)` | Deterministic hash from a string |
| `getStaggeredDate(slug)` | Consistent publish date per slug (Jun 2025–Jan 2026) |
| `groupByCategory(tools)` | Group tools into `Record<string, Tool[]>` |
| `hasSubstantiveContent(tool)` | Check if tool has enough content for comparisons |
| `generateComparisonPairs(tools)` | All same-category tool pairs for comparison pages |
| `splitBullets(text)` | Parse newline-separated bullet text into string array |
| `escapeHtml(text)` | HTML-escape untrusted strings (XSS prevention) |
