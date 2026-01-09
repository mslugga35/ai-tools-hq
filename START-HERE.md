# START HERE - ToolScout Business Setup

## What You're Building

An automated AI tools directory that earns $1,000+/month through:
- Affiliate commissions (30-50% recurring)
- Display ads (once you hit 10K monthly visitors)

## Total Cost: $32

| Item | Cost |
|------|------|
| Domain | $12 |
| OpenAI API | $20 |
| Everything else | FREE |

## Time Investment

| Phase | Time | You Do |
|-------|------|--------|
| Account setup | 20 min | Click links, sign up |
| Airtable import | 5 min | Upload CSV |
| Run setup script | 5 min | One command |
| Deploy to Vercel | 5 min | Click buttons |
| n8n workflows | 10 min | Import JSON files |
| Apply to affiliates | 30 min | Fill forms |
| **Total** | **~75 min** | Then hands-off |

---

## STEP 1: Create Accounts (20 min)

Open: `ACCOUNTS-SETUP.md`

Create accounts in this order:
1. ✅ Domain (Namecheap) - $12
2. ✅ GitHub - FREE
3. ✅ Vercel - FREE (connect to GitHub)
4. ✅ Airtable - FREE
5. ✅ n8n Cloud - FREE
6. ✅ OpenAI - Add $20 credit

**SAVE THESE CREDENTIALS:**
```
Airtable API Key: pat_________________
Airtable Base ID: app_________________
OpenAI API Key:   sk-_________________
```

---

## STEP 2: Set Up Airtable Database (5 min)

1. Go to airtable.com
2. Create new Base called "AI Tools"
3. Create table called "Tools"
4. Click the dropdown arrow next to "Tools" → "Import data"
5. Upload: `scripts/airtable-import.csv`
6. ✅ 100 tools now in your database

**Add these fields if not auto-created:**
- Description (Long text)
- Affiliate Link (URL)
- Features (Long text)
- Pros (Long text)
- Cons (Long text)
- Review (Long text)
- Generated (Checkbox)
- Published (Checkbox)

---

## STEP 3: Run Setup Script (5 min)

Open PowerShell in this folder and run:

```powershell
.\setup.ps1 -AirtableApiKey "YOUR_API_KEY" -AirtableBaseId "YOUR_BASE_ID"
```

This will:
- Install dependencies
- Create .env file
- Initialize git repository

**Test locally:**
```powershell
cd site
npm run dev
```

Visit http://localhost:4321 - you should see your site!

---

## STEP 4: Deploy to Vercel (5 min)

1. Push to GitHub:
```bash
cd site
git remote add origin https://github.com/YOUR_USERNAME/toolscout
git push -u origin main
```

2. Go to vercel.com/new
3. Import your repository
4. Add Environment Variables:
   - `AIRTABLE_API_KEY` = your key
   - `AIRTABLE_BASE_ID` = your base ID
5. Click Deploy
6. Wait 2-3 minutes

**Get your Vercel Deploy Hook:**
1. Vercel Dashboard → Your Project → Settings → Git
2. Scroll to "Deploy Hooks"
3. Create hook named "n8n"
4. Copy the URL

---

## STEP 5: Connect Custom Domain (10 min)

1. In Vercel: Settings → Domains → Add your domain
2. In Namecheap DNS settings:
   - Add CNAME: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.19.19`
3. Wait for SSL (10-30 min)

---

## STEP 6: Set Up n8n Workflows (10 min)

1. Go to app.n8n.cloud
2. Add credentials:
   - OpenAI (your API key)
   - Airtable (your API key)
3. Import workflows (Workflows → Import):
   - `n8n-workflows/generate-reviews.json`
   - `n8n-workflows/discover-new-tools.json`
   - `n8n-workflows/trigger-rebuild.json`
4. Update each workflow:
   - Replace credential IDs
   - Add `AIRTABLE_BASE_ID` environment variable
   - Add `VERCEL_DEPLOY_HOOK_URL` environment variable
5. Activate all workflows

**Generate initial content:**
- Run "Generate AI Tool Reviews" manually
- Wait for it to process all 100 tools (~30 min)
- Check Airtable - reviews should appear

---

## STEP 7: Publish Tools (5 min)

1. Go to Airtable
2. Review generated content
3. Check "Published" for tools with good reviews
4. Site auto-rebuilds nightly (or trigger manually)

---

## STEP 8: Apply to Affiliate Programs (30 min)

Open: `AFFILIATE-PROGRAMS.md`

Apply to these first (high approval rate):
1. jasper.ai/partners (30% recurring)
2. copy.ai/affiliates (45% first year)
3. writesonic.com/affiliates (30% recurring)
4. pictory.ai/affiliates (30% recurring)
5. synthesia.io/partners (20% recurring)

After approved, add affiliate links to Airtable.

---

## STEP 9: Submit to Search Engines (5 min)

1. Google Search Console: search.google.com/search-console
   - Add property
   - Verify via DNS
   - Submit sitemap: `yourdomain.com/sitemap-index.xml`

2. Bing Webmaster: bing.com/webmasters
   - Import from Google Search Console

---

## YOU'RE DONE! 🎉

### What Happens Now (Automatically)

| Day | Event |
|-----|-------|
| Daily | Google crawls new pages |
| Weekly | n8n finds new AI tools |
| Weekly | n8n generates reviews |
| Daily | Site rebuilds with new content |
| Monthly | Traffic grows from SEO |

### What You Do (Monthly)

- Check affiliate dashboards
- Cash out earnings
- Review auto-generated content (optional)

---

## Timeline to $1,000/month

| Month | Visitors | Revenue | Status |
|-------|----------|---------|--------|
| 1 | 100 | $0 | Indexing |
| 2 | 500 | $0 | Growing |
| 3 | 2,000 | $50 | First sales |
| 4 | 5,000 | $200 | Momentum |
| 5 | 10,000 | $500 | Add Ezoic ads |
| 6 | 15,000 | $1,000+ | Goal reached |

---

## Troubleshooting

**Site not loading?**
- Check Vercel deployment logs
- Verify environment variables are set

**Airtable not connecting?**
- Verify API key has correct scopes
- Check Base ID is correct

**n8n workflows failing?**
- Check credential IDs match
- Verify OpenAI has credit

**No traffic after 2 months?**
- Submit sitemap to Google Search Console
- Check robots.txt isn't blocking crawlers

---

## Files Reference

```
toolscout-business/
├── START-HERE.md          ← You are here
├── ACCOUNTS-SETUP.md      ← Account creation links
├── SETUP-CHECKLIST.md     ← Detailed checklist
├── AFFILIATE-PROGRAMS.md  ← Affiliate links & tips
├── setup.ps1              ← Automated setup script
├── scripts/
│   └── airtable-import.csv ← 100 tools to import
├── n8n-workflows/
│   ├── generate-reviews.json
│   ├── discover-new-tools.json
│   └── trigger-rebuild.json
└── site/                  ← The website
    ├── package.json
    ├── vercel.json
    ├── .env.example
    └── src/
        ├── pages/
        ├── components/
        ├── layouts/
        └── lib/
```

---

## Questions?

This system is designed to run without support. If something breaks:
1. Check the troubleshooting section above
2. Google the error message
3. Check service status pages (Vercel, Airtable, n8n)

Good luck! 🚀
