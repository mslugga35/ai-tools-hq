# Deploy AI Tools HQ to GitHub
# Run this script once to create repo and push

$ErrorActionPreference = "Stop"

Write-Host "Initializing Git repository..." -ForegroundColor Cyan
git init

Write-Host "Adding all files..." -ForegroundColor Cyan
git add -A

Write-Host "Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit - AI Tools HQ

Automated AI tools directory with:
- 100 AI tools database (Airtable)
- Astro static site
- n8n automation workflows
- Affiliate monetization ready

Co-Authored-By: Claude <noreply@anthropic.com>"

Write-Host "Creating GitHub repository..." -ForegroundColor Cyan
gh repo create ai-tools-hq --public --source=. --push

Write-Host ""
Write-Host "SUCCESS! Repository created." -ForegroundColor Green
Write-Host "Check: https://github.com/mslugga35/ai-tools-hq" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next step: Go to https://vercel.com/new and import the repo" -ForegroundColor Cyan
