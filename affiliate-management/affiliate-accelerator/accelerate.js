#!/usr/bin/env node

/**
 * AFFILIATE ACCELERATOR
 * =====================
 * 
 * Matches ai-tools-hq tools against known affiliate programs,
 * generates prioritized action plans, and provides bulk Supabase updates.
 * 
 * Usage:
 *   node accelerate.js              # Full report + HTML dashboard
 *   node accelerate.js --update     # Bulk update Supabase with links from links.json
 *   node accelerate.js --status     # Quick status check
 * 
 * Built: 2026-02-09 (Nightly Build)
 * Author: Damian
 */

const fs = require('fs').promises;
const path = require('path');

// Supabase config (anon key - read/write for generated tools)
const SUPABASE_URL = 'https://ebhtzgimevacvcgiyesc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaHR6Z2ltZXZhY3ZjZ2l5ZXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDIyMTksImV4cCI6MjA2ODM3ODIxOX0.msMqXGX33MIygHQWG4n2BdP8JVLOR9Yi5WkiDRwZEbY';

// ─── Supabase helpers ────────────────────────────────────────

async function supabaseFetch(endpoint) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${res.statusText}`);
  return res.json();
}

async function supabaseUpdate(table, id, data) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Update failed for id=${id}: ${res.status}`);
  return true;
}

// ─── Core logic ──────────────────────────────────────────────

async function loadAffiliateDB() {
  const raw = await fs.readFile(path.join(__dirname, 'affiliate-db.json'), 'utf-8');
  return JSON.parse(raw).programs;
}

function matchToolToProgram(tool, programs) {
  const toolSlug = (tool.slug || '').toLowerCase();
  const toolName = (tool.name || '').toLowerCase();
  
  for (const prog of programs) {
    // Match by slug
    for (const slug of prog.slugs) {
      if (toolSlug === slug || toolSlug.includes(slug) || slug.includes(toolSlug)) {
        return prog;
      }
    }
    // Match by name (fuzzy)
    const progName = prog.toolName.toLowerCase();
    if (toolName === progName || toolName.includes(progName) || progName.includes(toolName)) {
      return prog;
    }
  }
  return null;
}

function calculatePriority(prog) {
  if (!prog || !prog.applyUrl) return 0;
  
  let score = 0;
  
  // Commission weight (0-40 points)
  score += Math.min(prog.commissionPct * 1, 40);
  
  // Recurring bonus (20 points)
  if (prog.recurring) score += 20;
  
  // Ticket size (0-20 points)
  score += Math.min(prog.avgPlanPrice / 5, 20);
  
  // Cookie duration bonus (0-10 points)
  score += Math.min(prog.cookieDays / 12, 10);
  
  // Tier bonus
  if (prog.tier === 1) score += 15;
  else if (prog.tier === 2) score += 8;
  else if (prog.tier === 3) score += 3;
  
  return Math.round(score);
}

function estimateMonthlyRevenue(prog, monthlyVisitors = 10000) {
  if (!prog || !prog.applyUrl) return 0;
  // Assume 2% click rate, 3% conversion
  const clicks = monthlyVisitors * 0.02 / 129; // Split across tools
  const conversions = clicks * 0.03;
  if (prog.recurring) {
    return Math.round(conversions * prog.avgPlanPrice * (prog.commissionPct / 100) * 12); // Annual
  }
  return Math.round(conversions * prog.avgPlanPrice * (prog.commissionPct / 100));
}

// ─── Report generation ───────────────────────────────────────

async function generateReport() {
  console.log('🚀 AFFILIATE ACCELERATOR');
  console.log('========================\n');
  
  // Load data
  const programs = await loadAffiliateDB();
  const tools = await supabaseFetch('tools?select=id,name,slug,category,affiliate_link,website&generated=eq.true&order=name.asc');
  
  console.log(`📊 ${tools.length} tools in database`);
  console.log(`📋 ${programs.length} affiliate programs in DB\n`);
  
  // Categorize tools
  const matched = [];      // Has program match & no link yet
  const alreadyLinked = []; // Already has affiliate link
  const noProgram = [];     // No known program
  const noAffiliate = [];   // Program exists but explicitly no affiliate
  
  for (const tool of tools) {
    const hasLink = tool.affiliate_link && tool.affiliate_link !== tool.website && tool.affiliate_link.length > 5;
    const prog = matchToolToProgram(tool, programs);
    
    if (hasLink) {
      alreadyLinked.push({ tool, program: prog });
    } else if (prog && prog.applyUrl) {
      matched.push({ tool, program: prog, priority: calculatePriority(prog) });
    } else if (prog && !prog.applyUrl) {
      noAffiliate.push({ tool, program: prog });
    } else {
      noProgram.push({ tool });
    }
  }
  
  // Sort by priority
  matched.sort((a, b) => b.priority - a.priority);
  
  // Print results
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Already linked:     ${alreadyLinked.length}`);
  console.log(`🎯 Ready to apply:     ${matched.length}`);
  console.log(`❌ No affiliate prog:  ${noAffiliate.length}`);
  console.log(`❓ Unknown/research:   ${noProgram.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (alreadyLinked.length > 0) {
    console.log('✅ ALREADY LINKED:');
    for (const { tool } of alreadyLinked) {
      console.log(`   ${tool.name} → ${tool.affiliate_link?.substring(0, 60)}`);
    }
    console.log();
  }
  
  console.log('🎯 TOP 20 TO APPLY (by priority):');
  console.log('─'.repeat(80));
  const top20 = matched.slice(0, 20);
  for (let i = 0; i < top20.length; i++) {
    const { tool, program, priority } = top20[i];
    const stars = priority > 70 ? '🔥🔥🔥' : priority > 50 ? '🔥🔥' : '🔥';
    console.log(`${(i + 1).toString().padStart(2)}. ${stars} ${tool.name.padEnd(20)} | ${program.commission.padEnd(18)} | Cookie: ${program.cookieDays}d | Priority: ${priority}`);
    console.log(`    Apply: ${program.applyUrl}`);
    console.log(`    ${program.notes}`);
    console.log();
  }
  
  if (noAffiliate.length > 0) {
    console.log('\n❌ NO AFFILIATE PROGRAM (use as traffic drivers):');
    for (const { tool, program } of noAffiliate) {
      console.log(`   ${tool.name} - ${program.notes}`);
    }
  }
  
  // Generate action plan
  const actionPlan = {
    generated: new Date().toISOString(),
    summary: {
      totalTools: tools.length,
      alreadyLinked: alreadyLinked.length,
      readyToApply: matched.length,
      noProgram: noProgram.length + noAffiliate.length,
      estimatedMonthlyRevenue: matched.reduce((sum, m) => sum + estimateMonthlyRevenue(m.program), 0)
    },
    prioritizedActions: matched.map((m, i) => ({
      rank: i + 1,
      toolName: m.tool.name,
      toolSlug: m.tool.slug,
      toolId: m.tool.id,
      category: m.tool.category,
      priority: m.priority,
      program: {
        name: m.program.toolName,
        applyUrl: m.program.applyUrl,
        network: m.program.network,
        commission: m.program.commission,
        commissionPct: m.program.commissionPct,
        recurring: m.program.recurring,
        cookieDays: m.program.cookieDays,
        avgPlanPrice: m.program.avgPlanPrice,
        notes: m.program.notes
      }
    })),
    alreadyLinked: alreadyLinked.map(a => ({
      toolName: a.tool.name,
      link: a.tool.affiliate_link
    })),
    noProgram: [...noAffiliate, ...noProgram].map(n => ({
      toolName: n.tool.name,
      reason: n.program?.notes || 'No known affiliate program - needs research'
    }))
  };
  
  // Save action plan
  const planPath = path.join(__dirname, 'action-plan.json');
  await fs.writeFile(planPath, JSON.stringify(actionPlan, null, 2));
  console.log(`\n📄 Action plan saved: ${planPath}`);
  
  // Generate links template
  const linksTemplate = {};
  for (const m of matched) {
    linksTemplate[m.tool.slug] = {
      toolName: m.tool.name,
      toolId: m.tool.id,
      affiliateLink: '',  // Matt fills this in after applying
      applied: false,
      approved: false,
      applyUrl: m.program.applyUrl,
      commission: m.program.commission
    };
  }
  
  const linksPath = path.join(__dirname, 'links.json');
  // Only write if doesn't exist (don't overwrite Matt's work)
  try {
    await fs.access(linksPath);
    console.log(`📎 links.json already exists (not overwriting)`);
  } catch {
    await fs.writeFile(linksPath, JSON.stringify(linksTemplate, null, 2));
    console.log(`📎 Links template saved: ${linksPath}`);
    console.log(`   Fill in 'affiliateLink' for each tool, then run: node accelerate.js --update`);
  }
  
  // Generate HTML dashboard
  await generateDashboard(actionPlan, alreadyLinked, matched, noAffiliate, noProgram);
  
  return actionPlan;
}

// ─── HTML Dashboard ──────────────────────────────────────────

async function generateDashboard(plan, linked, matched, noAff, unknown) {
  const totalPotentialMonthly = matched.reduce((sum, m) => {
    const rev = estimateMonthlyRevenue(m.program, 20000);
    return sum + rev;
  }, 0);
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Affiliate Accelerator Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    .container { max-width: 1400px; margin: 0 auto; padding: 24px; }
    
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
    h1 span { color: #38bdf8; }
    .subtitle { color: #94a3b8; font-size: 1rem; margin-bottom: 32px; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .stat-card { background: #1e293b; border-radius: 12px; padding: 20px; border: 1px solid #334155; }
    .stat-card .label { color: #94a3b8; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-card .value { font-size: 2rem; font-weight: 700; margin-top: 4px; }
    .stat-card .value.green { color: #4ade80; }
    .stat-card .value.blue { color: #38bdf8; }
    .stat-card .value.amber { color: #fbbf24; }
    .stat-card .value.red { color: #f87171; }
    .stat-card .value.purple { color: #c084fc; }
    
    .progress-bar { background: #334155; border-radius: 999px; height: 8px; margin-top: 12px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 999px; transition: width 0.5s; }
    .progress-fill.green { background: #4ade80; }
    
    .section { margin-bottom: 32px; }
    .section-title { font-size: 1.3rem; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    
    table { width: 100%; border-collapse: collapse; }
    thead th { background: #1e293b; color: #94a3b8; font-weight: 500; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 16px; text-align: left; border-bottom: 2px solid #334155; position: sticky; top: 0; }
    tbody tr { border-bottom: 1px solid #1e293b; transition: background 0.15s; }
    tbody tr:hover { background: #1e293b; }
    tbody td { padding: 12px 16px; font-size: 0.9rem; }
    
    .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .badge.t1 { background: #4ade8022; color: #4ade80; border: 1px solid #4ade8044; }
    .badge.t2 { background: #38bdf822; color: #38bdf8; border: 1px solid #38bdf844; }
    .badge.t3 { background: #94a3b822; color: #94a3b8; border: 1px solid #94a3b844; }
    .badge.recurring { background: #c084fc22; color: #c084fc; border: 1px solid #c084fc44; }
    .badge.one-time { background: #fbbf2422; color: #fbbf24; border: 1px solid #fbbf2444; }
    .badge.done { background: #4ade8022; color: #4ade80; }
    .badge.no-prog { background: #f8717122; color: #f87171; }
    
    .priority-bar { display: inline-block; height: 6px; border-radius: 999px; background: linear-gradient(90deg, #4ade80, #38bdf8); }
    
    a { color: #38bdf8; text-decoration: none; }
    a:hover { text-decoration: underline; }
    
    .apply-btn { display: inline-block; background: #4ade80; color: #0f172a; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 0.8rem; text-decoration: none !important; }
    .apply-btn:hover { background: #22c55e; }
    
    .action-box { background: linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%); border: 1px solid #38bdf844; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
    .action-box h3 { color: #38bdf8; margin-bottom: 12px; }
    .action-box ol { padding-left: 20px; }
    .action-box li { margin-bottom: 8px; line-height: 1.5; }
    .action-box code { background: #334155; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; }
    
    .footer { text-align: center; color: #475569; padding: 24px; font-size: 0.85rem; }
    
    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      table { font-size: 0.8rem; }
      .container { padding: 16px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Affiliate <span>Accelerator</span></h1>
    <p class="subtitle">ai-tools-hq.com — Revenue Activation Dashboard • Generated ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Total Tools</div>
        <div class="value blue">${plan.summary.totalTools}</div>
      </div>
      <div class="stat-card">
        <div class="label">Already Linked</div>
        <div class="value green">${plan.summary.alreadyLinked}</div>
        <div class="progress-bar"><div class="progress-fill green" style="width: ${Math.round(plan.summary.alreadyLinked / plan.summary.totalTools * 100)}%"></div></div>
      </div>
      <div class="stat-card">
        <div class="label">Ready to Apply</div>
        <div class="value amber">${plan.summary.readyToApply}</div>
      </div>
      <div class="stat-card">
        <div class="label">No Program</div>
        <div class="value red">${plan.summary.noProgram}</div>
      </div>
      <div class="stat-card">
        <div class="label">Coverage</div>
        <div class="value purple">${Math.round(plan.summary.alreadyLinked / plan.summary.totalTools * 100)}%</div>
      </div>
    </div>
    
    <div class="action-box">
      <h3>⚡ Quick Start — Get Revenue Flowing in 30 Minutes</h3>
      <ol>
        <li><strong>Apply to Top 5 first</strong> — These have the highest commission × traffic potential</li>
        <li>Most programs approve within <strong>24-48 hours</strong></li>
        <li>Once approved, add your affiliate link to <code>links.json</code></li>
        <li>Run <code>node accelerate.js --update</code> to bulk-update Supabase</li>
        <li>Redeploy: <code>cd site && npm run build && vercel --prod</code></li>
      </ol>
    </div>
    
    <div class="section">
      <div class="section-title">🎯 Priority Apply List (${matched.length} tools with programs)</div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tool</th>
            <th>Category</th>
            <th>Commission</th>
            <th>Type</th>
            <th>Cookie</th>
            <th>Avg Price</th>
            <th>Priority</th>
            <th>Apply</th>
          </tr>
        </thead>
        <tbody>
${matched.map((m, i) => `          <tr>
            <td>${i + 1}</td>
            <td><strong>${m.tool.name}</strong></td>
            <td>${m.tool.category || '-'}</td>
            <td>${m.program.commission}</td>
            <td><span class="badge ${m.program.recurring ? 'recurring' : 'one-time'}">${m.program.recurring ? '♻️ Recurring' : '💰 One-time'}</span></td>
            <td>${m.program.cookieDays}d</td>
            <td>$${m.program.avgPlanPrice}/mo</td>
            <td><div class="priority-bar" style="width: ${m.priority}px" title="Score: ${m.priority}"></div> ${m.priority}</td>
            <td>${m.program.applyUrl ? `<a href="${m.program.applyUrl}" target="_blank" class="apply-btn">Apply →</a>` : '-'}</td>
          </tr>`).join('\n')}
        </tbody>
      </table>
    </div>
    
    ${linked.length > 0 ? `
    <div class="section">
      <div class="section-title">✅ Already Linked (${linked.length})</div>
      <table>
        <thead><tr><th>Tool</th><th>Affiliate Link</th><th>Status</th></tr></thead>
        <tbody>
${linked.map(l => `          <tr><td>${l.tool.name}</td><td><a href="${l.tool.affiliate_link}" target="_blank">${l.tool.affiliate_link?.substring(0, 60)}...</a></td><td><span class="badge done">✅ Active</span></td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>` : ''}
    
    <div class="section">
      <div class="section-title">❌ No Affiliate Program (${noAff.length} tools — use as traffic drivers)</div>
      <table>
        <thead><tr><th>Tool</th><th>Strategy</th></tr></thead>
        <tbody>
${noAff.map(n => `          <tr><td>${n.tool.name}</td><td>${n.program?.notes || 'Research needed'}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>
    
    ${unknown.length > 0 ? `
    <div class="section">
      <div class="section-title">❓ Needs Research (${unknown.length} tools)</div>
      <table>
        <thead><tr><th>Tool</th><th>Category</th><th>Website</th></tr></thead>
        <tbody>
${unknown.map(u => `          <tr><td>${u.tool.name}</td><td>${u.tool.category || '-'}</td><td><a href="${u.tool.website}" target="_blank">${u.tool.website?.substring(0, 50)}</a></td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>` : ''}
    
    <div class="footer">
      Built by Damian 🤖 • ${new Date().toISOString()} • ai-tools-hq.com Affiliate Accelerator
    </div>
  </div>
</body>
</html>`;
  
  const dashPath = path.join(__dirname, 'dashboard.html');
  await fs.writeFile(dashPath, html);
  console.log(`\n📊 Dashboard saved: ${dashPath}`);
  console.log('   Open in browser to see the full interactive report.');
}

// ─── Bulk updater ────────────────────────────────────────────

async function bulkUpdateLinks() {
  console.log('📤 BULK AFFILIATE LINK UPDATER');
  console.log('==============================\n');
  
  const linksPath = path.join(__dirname, 'links.json');
  let links;
  try {
    const raw = await fs.readFile(linksPath, 'utf-8');
    links = JSON.parse(raw);
  } catch (err) {
    console.error('❌ links.json not found. Run without --update first to generate it.');
    process.exit(1);
  }
  
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const [slug, info] of Object.entries(links)) {
    if (!info.affiliateLink || info.affiliateLink.trim() === '') {
      skipped++;
      continue;
    }
    
    try {
      await supabaseUpdate('tools', info.toolId, {
        affiliate_link: info.affiliateLink.trim()
      });
      console.log(`✅ ${info.toolName} → ${info.affiliateLink.substring(0, 50)}`);
      updated++;
    } catch (err) {
      console.error(`❌ ${info.toolName}: ${err.message}`);
      errors++;
    }
  }
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Updated: ${updated}`);
  console.log(`⏭️  Skipped (no link): ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`\n💡 After updating, redeploy: cd site && npm run build && vercel --prod`);
}

// ─── Quick status ────────────────────────────────────────────

async function quickStatus() {
  const tools = await supabaseFetch('tools?select=name,slug,affiliate_link,website&generated=eq.true');
  const withLink = tools.filter(t => t.affiliate_link && t.affiliate_link !== t.website && t.affiliate_link.length > 5);
  const pct = Math.round(withLink.length / tools.length * 100);
  
  console.log(`📊 Affiliate Coverage: ${withLink.length}/${tools.length} (${pct}%)`);
  console.log(`💰 Estimated monthly revenue at current coverage: $${Math.round(pct * 15)} (at 20K visitors)`);
  console.log(`🎯 Target: 50%+ coverage = $750+/mo potential`);
  
  if (withLink.length > 0) {
    console.log(`\n✅ Linked tools:`);
    withLink.forEach(t => console.log(`   ${t.name}: ${t.affiliate_link?.substring(0, 60)}`));
  }
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--update')) {
    await bulkUpdateLinks();
  } else if (args.includes('--status')) {
    await quickStatus();
  } else {
    await generateReport();
  }
}

main().catch(err => {
  console.error('💥 Error:', err.message);
  process.exit(1);
});
