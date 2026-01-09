# ToolScout Business - Automated Setup Script
# Run this after creating accounts (see ACCOUNTS-SETUP.md)

param(
    [string]$AirtableApiKey,
    [string]$AirtableBaseId,
    [string]$OpenAiApiKey
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ToolScout Business - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "ERROR: Node.js not installed. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js $nodeVersion found" -ForegroundColor Green

# Check Git
Write-Host "Checking Git..." -ForegroundColor Yellow
$gitVersion = git --version 2>$null
if (-not $gitVersion) {
    Write-Host "ERROR: Git not installed. Install from https://git-scm.com" -ForegroundColor Red
    exit 1
}
Write-Host "Git found" -ForegroundColor Green

# Navigate to site folder
$siteDir = Join-Path $PSScriptRoot "site"
Set-Location $siteDir

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Create .env file
Write-Host ""
Write-Host "Creating .env file..." -ForegroundColor Yellow

if ($AirtableApiKey -and $AirtableBaseId) {
    @"
AIRTABLE_API_KEY=$AirtableApiKey
AIRTABLE_BASE_ID=$AirtableBaseId
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host ".env file created with your credentials" -ForegroundColor Green
} else {
    Copy-Item ".env.example" ".env"
    Write-Host ".env.example copied to .env - YOU MUST EDIT THIS FILE" -ForegroundColor Yellow
    Write-Host "Add your Airtable API key and Base ID" -ForegroundColor Yellow
}

# Initialize Git
Write-Host ""
Write-Host "Initializing Git repository..." -ForegroundColor Yellow
git init
git add .
git commit -m "Initial commit - ToolScout AI Tools Directory"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  LOCAL SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env with your Airtable credentials (if not provided)" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to test locally" -ForegroundColor White
Write-Host "3. Create GitHub repo and push:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/toolscout" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host "4. Import to Vercel at vercel.com" -ForegroundColor White
Write-Host ""
Write-Host "See SETUP-CHECKLIST.md for full instructions" -ForegroundColor Yellow
