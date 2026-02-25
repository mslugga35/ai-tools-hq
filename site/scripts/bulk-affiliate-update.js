#!/usr/bin/env node
/**
 * Bulk Affiliate Link Updater
 * ============================
 * Updates affiliate_link field in Supabase for all tools.
 *
 * USAGE:
 *   1. Fill in your tracking URLs in AFFILIATE_LINKS below (after signing up)
 *   2. Run: node scripts/bulk-affiliate-update.js --dry-run   (preview)
 *   3. Run: node scripts/bulk-affiliate-update.js             (apply)
 *
 * IMPORTANT: Only add URLs you've been approved for.
 * Leaving a tool as null = website URL used as fallback (no tracking).
 *
 * Last research update: 2026-02-25 by Damian
 * See affiliate-tracker.md for full program database + sign-up URLs
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ebhtzgimevacvcgiyesc.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaHR6Z2ltZXZhY3ZjZ2l5ZXNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjgwMjIxOSwiZXhwIjoyMDY4Mzc4MjE5fQ.3EMyo7vA9ee2nGgg5WPu9cR4y39ka3Ww_L7nLnBgQ1M';

const isDryRun = process.argv.includes('--dry-run');

/**
 * AFFILIATE LINKS MAP
 * ===================
 * Key:   tool slug (from database)
 * Value: your affiliate tracking URL (null = pending sign-up, 'SKIP' = no program)
 *
 * 🟢 = SIGNED UP & IN DATABASE
 * 🔴 = HIGH PRIORITY — sign up ASAP, paste your tracking URL here
 * 🟡 = MEDIUM PRIORITY — sign up after top 10
 * 🔵 = LOW PRIORITY or undisclosed rates
 * 🚫 = NO AFFILIATE PROGRAM (skip, fallback to website URL)
 * ❓ = UNKNOWN — needs research
 *
 * SIGN-UP URLS (for Matt):
 * All sign-up URLs and commission details are in affiliate-tracker.md
 */
const AFFILIATE_LINKS = {

  // ============================================================
  // 🟢 ALREADY CONFIRMED (in database — do not change)
  // ============================================================
  'synthesia':       'https://synthesia.io?via=matt-morales',         // Rewardful, 20%/12mo
  'outseta':         'https://outseta.com/?via=matt-morales',         // Rewardful
  'elevenlabs':      'https://try.elevenlabs.io/f4il4v3cm496',        // Direct
  'signwell':        'https://www.signwell.com/?via=matt-morales',    // Rewardful
  'emailoctopus':    'https://emailoctopus.com/?ref=matt',            // Direct
  'zaap':            'https://app.zaap.ai/create-url/?ref=matt',      // Direct
  'baremetrics':     'https://baremetrics.com/?via=matt',             // Rewardful
  'movavi':          'https://www.awin1.com/cread.php?awinmid=22979&awinaffid=2777136&ued=https%3A%2F%2Fwww.movavi.com', // AWIN
  'cyber-suite-saas':'https://www.awin1.com/cread.php?awinmid=67878&awinaffid=2777136&ued=https%3A%2F%2Fcybersuite.com%2F', // AWIN

  // ============================================================
  // 🔴 PRIORITY 1 — SIGN UP TODAY
  // ============================================================

  // Taskade — 50% LIFETIME recurring | Sign up: https://partners.taskade.com/
  'taskade':        null,

  // Speechify — 40% per sale | Sign up: https://speechify.com/affiliates/
  'speechify':      null,

  // Copy.ai — 45% for 12 months | Sign up: https://www.copy.ai/partners
  'copy-ai':        null,

  // Grammarly — $20/premium signup | Sign up: https://www.grammarly.com/affiliates
  'grammarly':      null,

  // Fliki — 30% LIFETIME recurring | Sign up: https://affiliates.fliki.ai
  'fliki':          null,

  // HeyGen — 20% recurring 12 months | Sign up: https://heygen.getrewardful.com
  'heygen':         null,

  // Writesonic — 30% recurring | Sign up: https://affiliates.writesonic.com/signup
  'writesonic':     null,

  // Pictory — 20-50% tiered lifetime | Sign up: https://pictory.ai/partner-with-pictory
  'pictory':        null,

  // Colossyan — 25-50% tiered 12 months | Sign up: https://colossyan.getrewardful.com/signup
  'colossyan':      null,

  // AdCreative.ai — 30-40% recurring | Sign up: https://www.adcreative.ai/affiliate
  'adcreative-ai':  null,

  // ============================================================
  // 🔴 PRIORITY 2 — SIGN UP WEEK 2
  // ============================================================

  // QuillBot — 10-20% tiered | Sign up: https://quillbot.com/affiliates
  'quillbot':       null,

  // Murf.ai — 20% recurring 24 months | Sign up: https://murfai.partnerstack.com
  'murf-ai':        null,

  // Rytr — 30% recurring 12 months | Sign up: https://affiliates.rytr.me/signup
  'rytr':           null,

  // Sudowrite — 25% recurring 12 months | Sign up: https://sudowrite.getrewardful.com
  'sudowrite':      null,

  // Reclaim.ai — 40% recurring 12 months + $1/signup | Sign up: https://reclaim.ai/affiliate-program
  'reclaim-ai':     null,

  // Play.ht — 25% recurring | Sign up: https://play-ht.getrewardful.com/signup
  'play-ht':        null,

  // ============================================================
  // 🟡 PRIORITY 3 — SIGN UP WEEK 3-4
  // ============================================================

  // Elai.io — 25% recurring 12 months | Sign up: https://elai.getrewardful.com/signup
  'elai-io':        null,

  // Kapwing — 25-35% tiered recurring | Sign up: https://www.kapwing.com/affiliates
  'kapwing':        null,

  // Frase — 30-40% tiered 12 months | Sign up: https://affiliates.frase.io
  'frase':          null,

  // Surfer SEO — 15-25% tiered recurring | Sign up: https://surferseo.com/affiliate/
  'surfer-seo':     null,

  // Gamma — 30% first year | Sign up: https://gammaapp.partnerstack.com/?group=affiliates
  'gamma':          null,

  // Descript — $25 flat per subscriber | Sign up: https://www.descript.com/affiliate
  'descript':       null,

  // InVideo — 50% 1st month / 25% 1st year | Sign up: https://invideo.io/affiliate-program/
  'invideo':        null,

  // Fireflies.ai — 10-30% tiered 12 months | Sign up: https://fireflies.firstpromoter.com/
  'fireflies-ai':   null,

  // Veed.io — 20%+ recurring | Sign up: https://www.veed.io/affiliate (Impact.com)
  'veed-io':        null,

  // Opus Clip — 25% recurring 12 months | Sign up: https://www.opus.pro/affiliate
  'opus-clip':      null,

  // Lovo.ai — 20% recurring 24 months | Sign up: https://lovo.ai/affiliate-program
  'lovo-ai':        null,

  // Listnr — 30% recurring 12 months | Sign up: https://listnr.ai/affiliate-program
  'listnr':         null,

  // Podcastle — 20% for 12 months | Sign up: https://podcastle.ai/affiliate
  'podcastle':      null,

  // Motion — $50 flat per sub | Sign up: https://usemotion.partnerstack.com/?group=partners
  'motion':         null,

  // Steve.ai — up to 40% recurring | Sign up: https://www.steve.ai/affiliate
  'steve-ai':       null,

  // Lumen5 — 20% per sale | Sign up CJ: https://signup.cj.com/member/signup/publisher/?cid=5334062
  'lumen5':         null,

  // Anyword — 25% recurring | Sign up: https://anyword.com/affiliate (Impact.com)
  'anyword':        null,

  // WellSaid Labs — 30% first 3 payments | Email: jeff@wellsaidlabs.com
  'wellsaid-labs':  null,

  // ============================================================
  // 🔵 LOWER PRIORITY — RESEARCH NEEDED OR LOW COMMISSION
  // ============================================================

  // Notion AI — CURRENTLY CLOSED to new affiliates (check back later)
  // Sign up when open: https://www.notion.com/affiliates
  'notion-ai':      null,

  // Runway ML — undisclosed rates, check account footer at runwayml.com
  'runway-ml':      null,

  // Wordtune — undisclosed rates, check account at wordtune.com
  'wordtune':       null,

  // Otter.ai — possible Impact Radius program, needs verification
  'otter-ai':       null,

  // Clearscope — needs research
  'clearscope':     null,

  // Peppertype — needs research
  'peppertype':     null,

  // Ink Editor — needs research
  'ink-editor':     null,

  // Systeme.io — known for high commissions, needs research
  'systeme-io':     null,

  // ============================================================
  // 🚫 NO AFFILIATE PROGRAM — Skip (will use website as fallback)
  // ============================================================
  // These are left OUT of the map intentionally so they get skipped.
  // DO NOT add 'SKIP' values — just leave them missing.
  //
  // No program confirmed:
  //   chatgpt, claude, github-copilot, cursor, midjourney, dall-e-3, sora
  //   deepseek, grok, amazon-codewhisperer, amazon-sagemaker, google-vertex-ai
  //   microsoft-copilot, gemini, notebooklm, stable-diffusion, adobe-firefly
  //   jasper (DISCONTINUED Jan 2025), jasper-chat (DISCONTINUED)
  //   perplexity-ai (Comet referral ended Nov 2025)
  //   canva-ai (ended Jan 2024 — now invite-only Canvassador)
  //   devin, bolt-new, v0-by-vercel, veo-google, pika, kling-ai
  //   phrasee, persado, omneky, albert-ai, smartly-io
  //   dataiku, datarobot, resemble-ai, cleanvoice, suno

};

// ============================================================
// Script logic (don't edit below unless you know what you're doing)
// ============================================================

async function supabaseFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
    ...options.headers,
  };

  const resp = await fetch(url, { ...options, headers });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Supabase error ${resp.status}: ${text}`);
  }

  return resp;
}

async function updateAffiliateLink(slug, affiliateLink) {
  const body = JSON.stringify({ affiliate_link: affiliateLink });

  if (isDryRun) {
    console.log(`  [DRY RUN] Would update ${slug} → ${affiliateLink}`);
    return true;
  }

  await supabaseFetch(`tools?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    body,
  });

  return true;
}

async function main() {
  console.log(`\n🚀 Bulk Affiliate Link Updater${isDryRun ? ' (DRY RUN)' : ''}`);
  console.log('='.repeat(50));
  console.log('📖 See affiliate-tracker.md for sign-up URLs + commission details');

  // Get current state
  const resp = await supabaseFetch('tools?select=name,slug,affiliate_link,website&generated=eq.true&order=name.asc&limit=200');
  const tools = await resp.json();

  console.log(`\nFound ${tools.length} tools in database`);

  let updated = 0;
  let skipped = 0;
  let noProgram = 0;
  let alreadySet = 0;
  const errors = [];

  // Summary: how many have links now vs not
  const withLinks = tools.filter(t => t.affiliate_link).length;
  console.log(`Current coverage: ${withLinks}/${tools.length} tools have affiliate links (${Math.round(withLinks/tools.length*100)}%)\n`);

  for (const tool of tools) {
    const newLink = AFFILIATE_LINKS[tool.slug];

    // Not in our map at all = no affiliate program, skip
    if (newLink === undefined) {
      noProgram++;
      continue;
    }

    // Null = flagged as pending sign-up, show in report
    if (newLink === null) {
      skipped++;
      continue;
    }

    // Same link already in DB = skip
    if (tool.affiliate_link === newLink) {
      alreadySet++;
      console.log(`✅ ${tool.name} — already set`);
      continue;
    }

    try {
      await updateAffiliateLink(tool.slug, newLink);
      console.log(`✅ Updated: ${tool.name} → ${newLink.substring(0, 70)}...`);
      updated++;
    } catch (err) {
      console.error(`❌ Error updating ${tool.slug}: ${err.message}`);
      errors.push({ slug: tool.slug, error: err.message });
    }
  }

  // Show pending sign-ups
  const pendingTools = Object.entries(AFFILIATE_LINKS)
    .filter(([slug, link]) => link === null)
    .map(([slug]) => slug);

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`  ✅ Updated this run: ${updated}`);
  console.log(`  ✅ Already set: ${alreadySet}`);
  console.log(`  ⏸️  Pending sign-up: ${skipped}`);
  console.log(`  ➖ No affiliate program: ${noProgram}`);
  console.log(`  ❌ Errors: ${errors.length}`);

  if (pendingTools.length > 0) {
    console.log(`\n⏸️  Tools awaiting sign-up (${pendingTools.length}):`);
    pendingTools.forEach(slug => console.log(`  - ${slug}`));
    console.log('\n📖 See affiliate-tracker.md for sign-up URLs');
    console.log('💡 After signing up: paste your tracking URL into AFFILIATE_LINKS above, then re-run');
  }

  if (errors.length > 0) {
    console.log('\n⚠️  Errors:');
    errors.forEach(e => console.log(`  - ${e.slug}: ${e.error}`));
  }

  if (isDryRun) {
    console.log('\n💡 Remove --dry-run to apply changes to Supabase');
  } else if (updated > 0) {
    console.log('\n🎉 Done! Affiliate links updated in Supabase.');
    console.log('   Trigger a Vercel redeploy for changes to appear live.');
  }
}

main().catch(console.error);
