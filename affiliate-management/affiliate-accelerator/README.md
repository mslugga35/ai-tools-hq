# 🚀 Affiliate Accelerator

**One tool to go from $0 to $500+/mo in affiliate revenue.**

Built for ai-tools-hq.com to close the gap between "live site with 129 tools" and "actually making money."

## The Problem
- 129 AI tools listed on ai-tools-hq.com
- Only 7 have affiliate links (5% coverage)
- Site is live, getting traffic, earning $0

## The Solution

### 1. Generate Report + Dashboard
```bash
node accelerate.js
```
- Matches your 129 tools against 48 known affiliate programs
- Ranks by priority (commission %, recurring, cookie length, plan price)
- Generates `dashboard.html` — beautiful visual report
- Generates `action-plan.json` — machine-readable priority list
- Generates `links.json` — template for adding affiliate links

### 2. Get Application Templates
```bash
node apply-templates.js
```
- Copy-paste application messages for top 15 programs
- Pre-filled with ai-tools-hq.com info
- Covers: website description, promotion strategy, traffic estimates

### 3. Bulk Update Supabase
```bash
# After filling in links.json with your affiliate URLs:
node accelerate.js --update
```
- Reads links.json
- Updates Supabase `tools` table with affiliate_link values
- One command = all tools updated

### 4. Quick Status
```bash
node accelerate.js --status
```
- Shows current affiliate coverage %
- Lists all linked tools

## Workflow

1. **Matt opens `dashboard.html`** — sees priority list
2. **Clicks "Apply →"** on top tools — opens affiliate signup
3. **Copy-pastes from `application-templates.md`** when applying
4. **Gets approved** (usually 24-48 hours)
5. **Adds affiliate link to `links.json`**
6. **Runs `node accelerate.js --update`** — Supabase updated
7. **Redeploys site** — `cd site && npm run build && vercel --prod`
8. **💰 Revenue starts flowing**

## Files

| File | Purpose |
|------|---------|
| `accelerate.js` | Main tool — report, dashboard, bulk updater |
| `apply-templates.js` | Application message generator |
| `affiliate-db.json` | Database of known AI tool affiliate programs |
| `dashboard.html` | Visual priority dashboard (open in browser) |
| `action-plan.json` | Machine-readable action plan |
| `links.json` | Template for affiliate links (Matt fills in) |
| `application-templates.md` | Copy-paste application messages |

## Revenue Targets

| Coverage | Est. Monthly Rev (20K visitors) |
|----------|--------------------------------|
| 5% (now) | ~$0 |
| 25% | ~$200-400 |
| 50% | ~$500-900 |
| 75% | ~$800-1,500 |
