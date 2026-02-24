#!/usr/bin/env node

/**
 * AFFILIATE AUDIT SCRIPT
 * 
 * Connects to Supabase and audits which AI tools are missing affiliate links.
 * Critical for ai-tools-hq revenue generation (deadline Feb 7, 2026).
 * 
 * Usage: node affiliate-audit.js
 * Output: affiliate-audit-report.json
 */

// Supabase connection (from ai-tools-hq/site/src/lib/supabase.ts)
const SUPABASE_URL = 'https://ebhtzgimevacvcgiyesc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaHR6Z2ltZXZhY3ZjZ2l5ZXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDIyMTksImV4cCI6MjA2ODM3ODIxOX0.msMqXGX33MIygHQWG4n2BdP8JVLOR9Yi5WkiDRwZEbY';

const fs = require('fs').promises;

async function supabaseFetch(endpoint) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      console.error(`❌ Supabase error: ${res.status} ${res.statusText}`);
      return [];
    }
    
    return await res.json();
  } catch (err) {
    console.error('❌ Fetch failed:', err.message);
    return [];
  }
}

async function auditAffiliateLinks() {
  console.log('🔍 AFFILIATE LINK AUDIT - ai-tools-hq');
  console.log('=====================================\n');
  
  // Get all tools from Supabase
  console.log('📡 Connecting to Supabase...');
  const allTools = await supabaseFetch('tools?select=*&generated=eq.true&order=name.asc');
  
  if (!allTools || allTools.length === 0) {
    console.error('❌ No tools found in Supabase');
    return;
  }
  
  console.log(`✅ Found ${allTools.length} tools in database\n`);
  
  // Categorize tools by affiliate link status
  const toolsWithAffiliateLinks = [];
  const toolsMissingLinks = [];
  const toolsByCategory = {};
  
  for (const tool of allTools) {
    const hasAffiliate = tool.affiliate_link && 
                        tool.affiliate_link !== tool.website && 
                        tool.affiliate_link.trim() !== '';
    
    if (hasAffiliate) {
      toolsWithAffiliateLinks.push(tool);
    } else {
      toolsMissingLinks.push(tool);
    }
    
    // Group by category
    const category = tool.category || 'Other';
    if (!toolsByCategory[category]) {
      toolsByCategory[category] = { total: 0, withAffiliate: 0, missing: 0, tools: [] };
    }
    
    toolsByCategory[category].total++;
    if (hasAffiliate) {
      toolsByCategory[category].withAffiliate++;
    } else {
      toolsByCategory[category].missing++;
      toolsByCategory[category].tools.push({
        id: tool.id,
        name: tool.name,
        slug: tool.slug,
        website: tool.website,
        description: tool.description
      });
    }
  }
  
  // Generate report
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalTools: allTools.length,
      toolsWithAffiliateLinks: toolsWithAffiliateLinks.length,
      toolsMissingLinks: toolsMissingLinks.length,
      coveragePercentage: Math.round((toolsWithAffiliateLinks.length / allTools.length) * 100)
    },
    categories: toolsByCategory,
    criticalStats: {
      revenueBlocked: `$500-2000/mo`,
      deadline: 'Feb 7, 2026',
      daysLeft: Math.ceil((new Date('2026-02-07') - new Date()) / (1000 * 60 * 60 * 24))
    }
  };
  
  // Print summary to console
  console.log('📊 AUDIT RESULTS');
  console.log('================\n');
  console.log(`✅ Tools with affiliate links: ${report.summary.toolsWithAffiliateLinks}`);
  console.log(`❌ Tools missing affiliate links: ${report.summary.toolsMissingLinks}`);
  console.log(`📈 Coverage: ${report.summary.coveragePercentage}%\n`);
  
  console.log('📋 MISSING LINKS BY CATEGORY:');
  console.log('==============================');
  
  Object.entries(toolsByCategory)
    .filter(([_, data]) => data.missing > 0)
    .sort(([_, a], [__, b]) => b.missing - a.missing)
    .forEach(([category, data]) => {
      console.log(`\n📁 ${category}`);
      console.log(`   Missing: ${data.missing}/${data.total} tools`);
      console.log(`   Top tools: ${data.tools.slice(0, 3).map(t => t.name).join(', ')}${data.tools.length > 3 ? '...' : ''}`);
    });
  
  console.log(`\n🚨 CRITICAL: Only ${report.criticalStats.daysLeft} days until deadline!`);
  console.log('💰 Potential revenue blocked: $500-2000/mo\n');
  
  // Save to file
  const reportPath = 'ai-tools-hq/affiliate-management/affiliate-audit-report.json';
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`💾 Report saved to: ${reportPath}`);
  
  // Save tools missing links for easy access
  const missingLinksPath = 'ai-tools-hq/affiliate-management/tools-missing-affiliate-links.json';
  await fs.writeFile(missingLinksPath, JSON.stringify(toolsMissingLinks, null, 2));
  console.log(`📝 Missing links list: ${missingLinksPath}\n`);
  
  console.log('✅ Audit complete! Use this data to prioritize affiliate applications.');
  
  return report;
}

// Run if called directly
if (require.main === module) {
  auditAffiliateLinks().catch(console.error);
}

module.exports = { auditAffiliateLinks };