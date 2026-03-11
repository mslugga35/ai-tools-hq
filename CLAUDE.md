# AI Tools HQ
> Last verified: 2026-02-24

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

## n8n Workflows (5 total, 4 active)
| ID | Name | Schedule |
|----|------|----------|
| `Zx2Z0cOsgR0ILsis` | Generate Reviews | Daily 9 AM UTC |
| `ay2tej6jZBuOdjfO` | Social Auto-Poster | Daily 10 AM UTC |
| `7gp5X80SCm5lcBye` | SEO Content Generator | Weekly Mondays |
| `6LAIgQRc1SBqhnph` | Discover New Tools | Weekly Mondays 8 AM |
| `W7dXOsDOG0erIIOl` | Vercel Auto Rebuild | **DISABLED** — was costing $221/mo (deploy hook deleted 2026-02-24) |

## Vercel Deploy Hook
- **DELETED 2026-02-24** — hook `39WV6O1sEe` was being called ~99x/day (not 1x), causing 1,602 builds in 13 days ($221 in build minutes)
- **Do NOT recreate** — deploy manually with `vercel --prod` when needed
- n8n workflow `W7dXOsDOG0erIIOl` should be deactivated on cloud

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

## Deploying
- **Manual deploy only** (auto-deploy via hooks is disabled): `cd site && npx vercel --prod --scope mslugga35s-projects`
- **Audit script:** `node ~/scripts/vercel-audit.mjs --quick` (or `--full` or `--hooks`)

## Gotchas
- **NEVER create Vercel deploy hooks** — a rogue hook cost $221 in Feb 2026 (see Vercel Deploy Hook section above)
- Root `.gitignore` has `src/` — must use `git add -f` for `site/src/` files
- Bash `cd` to Windows paths fails — use `powershell.exe -Command "cd ...; command"`
- Supabase anon key is intentionally exposed (read-only, RLS enabled)
- **RLS requires BOTH `generated=true` AND `published=true`** — always set both when inserting tools
- `replace_all` in Edit tool will replace inside variable declarations too — watch for self-referencing bugs
- n8n scheduleTrigger must use typeVersion 1.2 (not 1.3) to activate on cloud
- n8n HTTP Request nodes must use typeVersion 4.2 on cloud
