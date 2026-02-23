# AI Tools HQ
> Last verified: 2026-02-23

## Project
- **Repo:** `github.com/mslugga35/ai-tools-hq` (branch: `master`)
- **Live:** https://www.ai-tools-hq.com
- **Admin:** https://www.ai-tools-hq.com/admin (noindex, live Supabase dashboard)
- **Local scripts:** `C:\Users\mpmmo\ai-tools-hq-local\`
- **Stack:** Astro SSG + Supabase REST + Vercel
- **Tools:** 129 (all reviewed, all published, 7 with affiliate links)

## Key Architecture
- **Data:** `site/src/lib/supabase.ts` — REST fetcher, anon key (public/RLS), `Tool` interface
- **SEO utils:** `site/src/lib/seo-utils.ts` — splitBullets, escapeHtml, slugHash, getStaggeredDate, generateComparisonPairs, groupByCategory, hasSubstantiveContent
- **Docs:** `site/src/lib/README.md` — architecture + export reference
- **Sitemap:** Custom `site/src/pages/sitemap.xml.ts` (not @astrojs/sitemap plugin)
- **Build:** `powershell.exe -Command "cd C:\Users\mpmmo\toolscout-business\site; npm run build"`

## n8n Workflows (5 total, ALL active)
| ID | Name | Schedule |
|----|------|----------|
| `Zx2Z0cOsgR0ILsis` | Generate Reviews | Daily 9 AM UTC |
| `ay2tej6jZBuOdjfO` | Social Auto-Poster | Daily 10 AM UTC |
| `7gp5X80SCm5lcBye` | SEO Content Generator | Weekly Mondays |
| `6LAIgQRc1SBqhnph` | Discover New Tools | Weekly Mondays 8 AM |
| `W7dXOsDOG0erIIOl` | Vercel Auto Rebuild | Daily 11 AM UTC |

## Vercel Deploy Hook
- **URL:** `https://api.vercel.com/v1/integrations/deploy/prj_DGFoNxOfMxu7CAyFacGlLHNKbT3p/39WV6O1sEe`
- **Project ID:** `prj_DGFoNxOfMxu7CAyFacGlLHNKbT3p`

## Affiliate Links (7 active)
| Tool | Link |
|------|------|
| Synthesia | `https://synthesia.io?via=matt-morales` |
| ElevenLabs | `https://try.elevenlabs.io/f4il4v3cm496` |
| Zaap | `https://app.zaap.ai/create-url/?ref=matt` |
| Baremetrics | `https://baremetrics.com/?via=matt` |
| SignWell | `https://www.signwell.com/?via=matt-morales` |
| EmailOctopus | `https://emailoctopus.com/?ref=matt` |
| Outseta | `https://outseta.com/?via=matt-morales` |

## Gotchas
- Root `.gitignore` has `src/` — must use `git add -f` for `site/src/` files
- Bash `cd` to Windows paths fails — use `powershell.exe -Command "cd ...; command"`
- Supabase anon key is intentionally exposed (read-only, RLS enabled)
- **RLS requires BOTH `generated=true` AND `published=true`** — always set both when inserting tools
- `getToolBySlug` in supabase.ts uses `encodeURIComponent` for safety
- `replace_all` in Edit tool will replace inside variable declarations too — watch for self-referencing bugs
- n8n scheduleTrigger must use typeVersion 1.2 (not 1.3) to activate on cloud
- n8n HTTP Request nodes must use typeVersion 4.2 on cloud
