# ToolScout Business - Complete Setup Checklist

## Day 1: Foundation (2-3 hours)

### 1. Domain & Accounts
- [ ] Buy domain at namecheap.com (~$12)
  - Suggestions: toolscout.ai, aitoolhub.com, aifindr.com
- [ ] Create GitHub account (github.com) - FREE
- [ ] Create Vercel account (vercel.com) - FREE
  - Sign up with GitHub
- [ ] Create Airtable account (airtable.com) - FREE
- [ ] Create n8n Cloud account (n8n.io) - FREE tier
- [ ] Create OpenAI account (platform.openai.com)
  - Add $20 credit

### 2. Set Up Airtable Database
- [ ] Create new base called "AI Tools"
- [ ] Create table called "Tools" with fields:

| Field Name | Type | Notes |
|------------|------|-------|
| Name | Single line text | Required |
| Slug | Single line text | URL-safe version of name |
| Category | Single select | Writing, Image, Video, Audio, Coding, Productivity, Marketing, Data |
| Description | Long text | AI-generated |
| Website | URL | |
| Affiliate Link | URL | Your affiliate link |
| Pricing | Single line text | e.g., "Free tier, Pro $20/mo" |
| Features | Long text | AI-generated |
| Pros | Long text | AI-generated |
| Cons | Long text | AI-generated |
| Review | Long text | AI-generated |
| Generated | Checkbox | Has AI review been generated? |
| Published | Checkbox | Is it live on site? |

- [ ] Get your Airtable API key: airtable.com/account
- [ ] Get your Base ID: airtable.com/api → select your base → copy ID from URL

### 3. Seed Initial Tools (100 tools)

Add these tools manually (takes ~2 hours):

**Writing Tools:**
- Jasper (jasper.ai) - Writing, $49/mo
- Copy.ai (copy.ai) - Writing, Free tier
- Writesonic (writesonic.ai) - Writing, $19/mo
- Rytr (rytr.me) - Writing, Free tier
- Wordtune (wordtune.com) - Writing, Free tier
- QuillBot (quillbot.com) - Writing, Free tier
- Grammarly (grammarly.com) - Writing, Free tier
- Hemingway (hemingwayapp.com) - Writing, Free
- Sudowrite (sudowrite.com) - Writing, $19/mo
- Anyword (anyword.com) - Writing, $39/mo

**Image Tools:**
- Midjourney (midjourney.com) - Image, $10/mo
- DALL-E (openai.com) - Image, Pay per use
- Stable Diffusion (stability.ai) - Image, Free/Open source
- Leonardo.AI (leonardo.ai) - Image, Free tier
- Ideogram (ideogram.ai) - Image, Free tier
- Adobe Firefly (firefly.adobe.com) - Image, Free tier
- Canva AI (canva.com) - Image, Free tier
- Playground AI (playground.ai) - Image, Free tier
- NightCafe (nightcafe.studio) - Image, Free credits
- Lexica (lexica.art) - Image, Free

**Video Tools:**
- Synthesia (synthesia.io) - Video, $30/mo
- HeyGen (heygen.com) - Video, $29/mo
- Pictory (pictory.ai) - Video, $19/mo
- Descript (descript.com) - Video, Free tier
- Runway (runway.ml) - Video, Free tier
- Kapwing (kapwing.com) - Video, Free tier
- InVideo (invideo.io) - Video, Free tier
- Lumen5 (lumen5.com) - Video, Free tier
- Elai (elai.io) - Video, $29/mo
- Steve.AI (steve.ai) - Video, $15/mo

**Productivity Tools:**
- Notion AI (notion.so) - Productivity, $10/mo add-on
- Otter.ai (otter.ai) - Productivity, Free tier
- Mem.ai (mem.ai) - Productivity, Free tier
- Taskade (taskade.com) - Productivity, Free tier
- Coda AI (coda.io) - Productivity, Free tier
- Reclaim.ai (reclaim.ai) - Productivity, Free tier
- Motion (usemotion.com) - Productivity, $19/mo
- Clockwise (clockwise.com) - Productivity, Free tier
- Sunsama (sunsama.com) - Productivity, $20/mo
- Akiflow (akiflow.com) - Productivity, $15/mo

...continue adding tools from:
- theresanaiforthat.com
- futuretools.io
- toolify.ai

---

## Day 2: Content Generation (1-2 hours)

### 4. Set Up n8n Workflows
- [ ] Log into n8n Cloud
- [ ] Create OpenAI credential:
  - Settings → Credentials → Add → OpenAI
  - Paste your API key
- [ ] Create Airtable credential:
  - Settings → Credentials → Add → Airtable
  - Paste your API key
- [ ] Import workflow from `n8n-workflows/generate-reviews.json`
  - Update credential IDs
  - Update Base ID
- [ ] Run workflow manually to generate first 5 reviews
- [ ] Check Airtable - reviews should appear
- [ ] Repeat until all 100 tools have reviews

### 5. Mark Tools as Published
- [ ] Review generated content in Airtable
- [ ] Check "Published" checkbox for quality reviews
- [ ] Aim for 50-100 published tools initially

---

## Day 3: Deploy Website (1 hour)

### 6. Set Up Site
- [ ] Clone/download the `site` folder to your computer
- [ ] Open terminal in that folder
- [ ] Run: `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in your Airtable API key and Base ID
- [ ] Run: `npm run dev` to test locally
- [ ] Verify tools are loading from Airtable

### 7. Deploy to Vercel
- [ ] Push site folder to GitHub:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USERNAME/toolscout
  git push -u origin main
  ```
- [ ] Go to vercel.com
- [ ] Click "Import Project"
- [ ] Select your GitHub repo
- [ ] Add environment variables:
  - AIRTABLE_API_KEY
  - AIRTABLE_BASE_ID
- [ ] Click Deploy
- [ ] Wait 2-3 minutes
- [ ] Visit your-project.vercel.app to verify

### 8. Connect Custom Domain
- [ ] In Vercel: Settings → Domains → Add
- [ ] Enter your domain (e.g., toolscout.ai)
- [ ] Update DNS at Namecheap:
  - Add CNAME record: www → cname.vercel-dns.com
  - Add A record: @ → 76.76.19.19
- [ ] Wait for SSL (usually 10-30 minutes)

---

## Day 4: Monetization (1-2 hours)

### 9. Join Affiliate Programs
Apply to these (high approval rate):

| Program | Commission | URL |
|---------|------------|-----|
| Jasper | 30% recurring | jasper.ai/partners |
| Copy.ai | 45% first year | copy.ai/affiliates |
| Writesonic | 30% recurring | writesonic.com/affiliates |
| Pictory | 30% recurring | pictory.ai/affiliates |
| Synthesia | 20% recurring | synthesia.io/partners |
| Descript | 15% recurring | descript.com/affiliates |
| Notion | $10 per signup | notion.so/affiliates |
| Canva | $36 per sub | canva.com/affiliates |

- [ ] Apply to at least 5 programs
- [ ] Wait for approval (usually 1-3 days)
- [ ] Add affiliate links to Airtable

### 10. Set Up Analytics
- [ ] Create Google Analytics 4 property
- [ ] Add GA4 tracking code to Layout.astro
- [ ] Set up Google Search Console
- [ ] Submit sitemap: yourdomain.com/sitemap-index.xml

---

## Day 5+: Automation (30 mins)

### 11. Enable Automated Growth
- [ ] Import `n8n-workflows/discover-new-tools.json`
- [ ] Set up Vercel webhook for rebuilds:
  - Vercel → Settings → Git → Deploy Hooks
  - Create hook named "n8n-rebuild"
  - Add webhook URL to n8n workflow
- [ ] Activate both n8n workflows
- [ ] Test by running manually once

---

## Monthly Maintenance (30 mins/month)

- [ ] Check affiliate dashboards
- [ ] Review any new tools added by automation
- [ ] Mark quality reviews as Published
- [ ] Cash out affiliate earnings

---

## Revenue Milestones

| Month | Expected Visitors | Expected Revenue |
|-------|-------------------|------------------|
| 1 | 100 | $0 |
| 2 | 500 | $0 |
| 3 | 2,000 | $50 |
| 4 | 5,000 | $200 |
| 5 | 10,000 | $500 |
| 6+ | 15,000+ | $1,000+ |

**Note:** SEO takes 3-6 months to compound. Be patient.

---

## Scaling Tips (Month 6+)

Once hitting $500/month:
1. Apply to Ezoic for display ads (requires 10K pageviews)
2. Create more comparison pages ("X vs Y")
3. Create "Best of" listicles
4. Consider sponsored listings ($200-500/month per slot)

---

## Support Resources

- Airtable docs: airtable.com/guides
- n8n docs: docs.n8n.io
- Vercel docs: vercel.com/docs
- Astro docs: docs.astro.build
