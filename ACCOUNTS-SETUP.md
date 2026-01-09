# Account Setup - Click Each Link and Sign Up

## Required Accounts (Do This First)

### 1. Domain (~$12)
**URL:** https://www.namecheap.com/domains/

1. Search for available domain (suggestions below)
2. Add to cart, checkout
3. Skip upsells

**Domain suggestions:**
- toolscout.ai
- aitoolhub.com
- aifindr.com
- toolcompare.ai
- bestaltools.com

---

### 2. GitHub (FREE)
**URL:** https://github.com/signup

1. Sign up with email
2. Verify email
3. Skip personalization

**Save this:** Your GitHub username

---

### 3. Vercel (FREE)
**URL:** https://vercel.com/signup

1. Click "Continue with GitHub"
2. Authorize Vercel
3. Skip team creation (use Hobby plan)

**Note:** This connects to GitHub automatically

---

### 4. Airtable (FREE)
**URL:** https://airtable.com/signup

1. Sign up with email
2. Skip templates
3. Create workspace called "ToolScout"

**After signup, get your credentials:**

**API Key:**
1. Go to: https://airtable.com/create/tokens
2. Click "Create new token"
3. Name: "ToolScout"
4. Scopes: check `data.records:read`, `data.records:write`, `schema.bases:read`
5. Access: Add your "ToolScout" base
6. Create token
7. **COPY AND SAVE THIS TOKEN** (shown once only)

**Base ID:**
1. Go to: https://airtable.com/developers/web/api/introduction
2. Select your ToolScout base
3. Copy the Base ID from the URL (starts with `app`)

**Save these:**
- API Key: `pat...`
- Base ID: `app...`

---

### 5. n8n Cloud (FREE)
**URL:** https://n8n.io/cloud/

1. Click "Start free"
2. Sign up with email
3. Choose free tier

**After signup:**
1. Go to Settings → Credentials
2. Add OpenAI credential (need OpenAI API key first)
3. Add Airtable credential (use your API key from above)

---

### 6. OpenAI (Pay ~$20)
**URL:** https://platform.openai.com/signup

1. Sign up with email
2. Add payment method
3. Add $20 credit

**Get API Key:**
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name: "ToolScout"
4. **COPY AND SAVE THIS KEY** (shown once only)

**Save this:** API Key: `sk-...`

---

## After All Accounts Created

Run the setup script:

```powershell
cd C:\Users\mpmmo\toolscout-business
.\setup.ps1 -AirtableApiKey "YOUR_KEY" -AirtableBaseId "YOUR_BASE_ID"
```

Or manually edit `site/.env` with your credentials.

---

## Credential Checklist

Before proceeding, confirm you have:

- [ ] Domain purchased and accessible
- [ ] GitHub account created
- [ ] Vercel connected to GitHub
- [ ] Airtable API Key: `pat________________`
- [ ] Airtable Base ID: `app________________`
- [ ] n8n Cloud account active
- [ ] OpenAI API Key: `sk-________________`
- [ ] OpenAI has $20+ credit

---

## Quick Links Reference

| Service | Dashboard | Credentials |
|---------|-----------|-------------|
| Namecheap | namecheap.com/myaccount | N/A |
| GitHub | github.com | N/A |
| Vercel | vercel.com/dashboard | N/A |
| Airtable | airtable.com | airtable.com/create/tokens |
| n8n | app.n8n.cloud | Settings → Credentials |
| OpenAI | platform.openai.com | platform.openai.com/api-keys |

---

## Total Time: ~20 minutes

Most time is spent waiting for verification emails.
