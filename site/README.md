# AI Tools HQ

> A curated directory of 120+ AI tools with reviews, comparisons, and affiliate monetization.

**Live Site:** https://www.ai-tools-hq.com
**Stack:** Astro 4.x + Supabase + Vercel
**Last Updated:** 2026-02-06

---

## Project Structure

```
site/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ToolCard.astro   # Tool listing card
│   │   └── Newsletter.astro # Email capture component
│   ├── layouts/
│   │   └── Layout.astro     # Base layout (header, footer, SEO)
│   ├── lib/
│   │   ├── supabase.ts      # Database layer (REST fetcher, Tool interface)
│   │   ├── seo-utils.ts     # SEO helpers (splitBullets, escapeHtml, slugHash, etc.)
│   │   └── README.md        # Architecture + export reference
│   └── pages/            # Route files
│       ├── index.astro      # Homepage
│       ├── tools/
│       │   ├── index.astro  # /tools listing
│       │   └── [slug].astro # /tools/:slug detail pages
│       ├── compare/
│       │   └── [...slugs].astro # /compare/:tool1/:tool2
│       ├── category/
│       │   └── [category].astro
│       ├── best/
│       │   └── [list].astro # /best/ai-writing-tools etc
│       ├── blog/            # Markdown blog posts
│       ├── about.astro
│       ├── contact.astro
│       ├── privacy.astro
│       ├── terms.astro
│       └── sitemap.xml.ts   # Custom sitemap generator
├── public/               # Static assets
├── .env                  # Environment variables (gitignored)
├── astro.config.mjs      # Astro configuration
├── vercel.json           # Vercel deploy config + headers
└── package.json
```

---

## Database

**Provider:** Supabase (PostgreSQL)
**Project:** ebhtzgimevacvcgiyesc

### Tools Table Schema
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Tool name (e.g., "ChatGPT") |
| slug | text | URL slug (e.g., "chatgpt") |
| category | text | Category (Writing, Image, Video, etc.) |
| description | text | Short description |
| website | text | Official website URL |
| affiliate_link | text | Affiliate/tracking URL |
| pricing | text | Pricing info |
| features | text | Feature list (comma-separated) |
| pros | text | Pros (comma-separated) |
| cons | text | Cons (comma-separated) |
| review | text | Full review text |
| generated | boolean | True if content is complete |

### API Access
- Website uses Supabase REST API with **anon key** (read-only, RLS: only `generated=true`)
- Admin scripts use **service key** (full access, bypasses RLS)
- See `src/lib/supabase.ts` for data layer

---

## Environment Variables

```bash
# .env
SUPABASE_URL=https://ebhtzgimevacvcgiyesc.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

The anon key is designed to be public (read-only access with RLS).

---

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## Generated Pages

| Page Type | Count | Example |
|-----------|-------|---------|
| Tool pages | 122 | /tools/chatgpt |
| Compare pages | ~600 | /compare/chatgpt-vs-claude |
| Category pages | ~10 | /category/writing |
| Best-of pages | 7 | /best/ai-writing-tools |
| Blog posts | 3 | /blog/chatgpt-vs-claude-comparison |
| Static pages | 6 | /about, /contact, etc. |
| **Total** | **~750** | |

---

## Automation

Daily tasks run on **n8n Cloud** (mslugga35.app.n8n.cloud):

| Workflow | Schedule | Purpose |
|----------|----------|---------|
| Generate Reviews | Daily 9 AM | AI-generates reviews for new tools |
| Social Auto-Poster | Daily 10 AM | Posts tools to Twitter/X |
| SEO Content Generator | Weekly | Creates blog content |

Local admin scripts at `C:\Users\mpmmo\ai-tools-hq-local\` for manual/batch operations.

---

## Monetization

- Affiliate links in `affiliate_link` column per tool
- "Try Free" buttons use affiliate tracking URLs
- Affiliate disclosures on review pages and footer
- Programs: Synthesia, ElevenLabs, + 28 more pending signup

---

## Deployment

**Host:** Vercel
**Auto-deploy:** On push to master branch
**Build Command:** `npm run build`
**Output:** Static HTML (pre-rendered at build time)

Database changes require a site rebuild to appear.

---

## Owner

**Matt Morales** — github.com/mslugga35
