# ToolScout.ai - Automated AI Tools Directory

## Quick Start

1. Clone this repo
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your keys
4. Run `npm run dev` to preview
5. Push to GitHub and deploy on Vercel

## Structure

```
├── src/
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   ├── tools/[slug].astro   # Individual tool pages
│   │   ├── category/[cat].astro # Category listings
│   │   └── compare/[...slug].astro # Comparison pages
│   ├── components/
│   │   ├── ToolCard.astro
│   │   ├── ReviewSection.astro
│   │   └── AffiliateButton.astro
│   └── lib/
│       └── airtable.ts          # Airtable integration
├── n8n-workflows/
│   ├── generate-reviews.json
│   ├── discover-new-tools.json
│   └── weekly-rebuild.json
└── scripts/
    └── seed-database.js         # Initial tool import
```

## Monetization

- Affiliate links in tool pages (20-50% commission)
- Display ads via Ezoic (after 10K pageviews)
- Sponsored listings (future, $200-500/month)

## Automation

All workflows run via n8n Cloud (free tier):
- Weekly: Discover new AI tools from ProductHunt
- Weekly: Generate reviews for new tools
- On-change: Rebuild site via Vercel webhook
