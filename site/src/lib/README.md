# site/src/lib — Shared Utilities

## Architecture

- **Framework:** Astro 4 (static site generation)
- **Data:** Supabase PostgreSQL via REST API (anon key, RLS)
- **Hosting:** Vercel (static deploy)
- **Pages:** ~711 (99 tool reviews, ~600 comparison pages, category pages, best-of lists)

## Modules

### supabase.ts

Data layer for the tools catalog. All data flows through `supabaseFetch()`.

| Export | Description |
|--------|-------------|
| `Tool` | TypeScript interface for tool records |
| `getAllTools()` | All published tools (generated=true), sorted by name |
| `getCategories()` | Unique category names (derived from `getAllTools` cache) |

**Build-time caching:** Requests are deduplicated via an in-memory `Map`. Calling `getAllTools()` from multiple pages only hits Supabase once per build.

**Timeout:** All fetches abort after 15 seconds (`FETCH_TIMEOUT_MS`) to prevent build hangs.

**Security:** Uses the Supabase anon key (public, read-only). Row Level Security (RLS) is enforced server-side. The key is intentionally exposed — it's designed for client-side access.

### seo-utils.ts

Shared helpers for SEO schema markup, comparison page generation, and content formatting.

| Export | Description |
|--------|-------------|
| `slugHash(str)` | Deterministic 32-bit hash from a string |
| `getStaggeredDate(slug)` | Consistent publish date per slug (Jun 2025–Jan 2026 window) |
| `groupByCategory(tools)` | Group tools into `Record<string, Tool[]>` |
| `hasSubstantiveContent(tool)` | Returns true if tool has enough text for a comparison page |
| `generateComparisonPairs(tools)` | All same-category tool pairs (alphabetically ordered) |
| `splitBullets(text)` | Parse newline-separated bullet text into `string[]` |
| `escapeHtml(text)` | HTML-escape untrusted strings (XSS prevention for `set:html`) |

## Key Patterns

- **No Supabase SDK needed** — Uses raw REST API with `fetch()` to keep the bundle small
- **All data is fetched at build time** — No runtime API calls in production
- **Comparison pairs are deterministic** — Same input tools always produce same pairs in same order
- **Staggered dates use slug hashing** — Provides realistic `datePublished` spread for schema markup
