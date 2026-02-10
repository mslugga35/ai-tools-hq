#!/usr/bin/env node

/**
 * BULK AFFILIATE MANAGEMENT SYSTEM
 * 
 * Comprehensive tool for managing affiliate links at scale:
 * - Audit current coverage (fixed paths)
 * - Bulk update tools with affiliate links
 * - Revenue potential calculator
 * - Program application tracker
 * 
 * Built: 2026-02-10 by Damian
 * For: ai-tools-hq monetization (currently $0 revenue from 129 tools)
 */

const fs = require('fs').promises;
const path = require('path');

// Supabase connection
const SUPABASE_URL = 'https://ebhtzgimevacvcgiyesc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaHR6Z2ltZXZhY3ZjZ2l5ZXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDIyMTksImV4cCI6MjA2ODM3ODIxOX0.msMqXGX33MIygHQWG4n2BdP8JVLOR9Yi5WkiDRwZEbY';

async function supabaseFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!res.ok) {
      throw new Error(`Supabase error: ${res.status} ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`❌ Supabase request failed:`, error);
    throw error;
  }
}

// High-value affiliate programs with commission rates
const AFFILIATE_PROGRAMS = {
  'OpenAI': { commission: '0%', type: 'credits', note: 'No affiliate program' },
  'Anthropic': { commission: '0%', type: 'none', note: 'No affiliate program' },
  'Grammarly': { commission: '$20', type: 'CPA', program: 'Impact.com' },
  'Synthesia': { commission: '25%', type: 'recurring', program: 'Direct' },
  'ElevenLabs': { commission: '22%', type: 'recurring', program: 'Direct' },
  'Pictory': { commission: '30%', type: 'recurring', program: 'Direct', status: 'pending' },
  'Jasper': { commission: '30%', type: 'recurring', program: 'Impact.com' },
  'Copy.ai': { commission: '25%', type: 'recurring', program: 'Direct' },
  'Notion': { commission: '$10', type: 'CPA', program: 'Impact.com' },
  'Canva': { commission: '$36-$50', type: 'CPA', program: 'Impact.com' },
  'Adobe': { commission: '85%', type: 'first-month', program: 'CJ Affiliate' },
  'Loom': { commission: '25%', type: 'recurring', program: 'Direct' },
  'Zapier': { commission: '25%', type: 'recurring', program: 'Impact.com' },
  'Calendly': { commission: '20%', type: 'recurring', program: 'Direct' },
  'Monday.com': { commission: '30%', type: 'recurring', program: 'Impact.com' }
};

// Revenue potential calculator
function calculateRevenuePotential(tools) {
  const highValue = tools.filter(t => t.pricing && (
    t.pricing.includes('$') && 
    (parseInt(t.pricing.match(/\$(\d+)/)?.[1] || 0) >= 10)
  )).length;
  
  const mediumValue = tools.filter(t => t.pricing && (
    t.pricing.includes('$') && 
    (parseInt(t.pricing.match(/\$(\d+)/)?.[1] || 0) >= 5)
  )).length - highValue;
  
  const lowValue = tools.length - highValue - mediumValue;
  
  // Conservative estimates based on 1000 monthly visitors
  const monthlyRevenue = {
    high: highValue * 50,  // High-value tools: $50/mo avg
    medium: mediumValue * 15, // Medium-value: $15/mo avg  
    low: lowValue * 3      // Low-value/free: $3/mo avg
  };
  
  return {
    high: highValue,
    medium: mediumValue, 
    low: lowValue,
    monthlyRevenue,
    total: monthlyRevenue.high + monthlyRevenue.medium + monthlyRevenue.low,
    yearly: (monthlyRevenue.high + monthlyRevenue.medium + monthlyRevenue.low) * 12
  };
}

async function auditAffiliateLinks() {
  console.log('🔍 AI TOOLS HQ - AFFILIATE MANAGEMENT SYSTEM');
  console.log('===========================================\n');
  
  console.log('📡 Connecting to Supabase...');
  const tools = await supabaseFetch('tools?select=*&generated=eq.true');
  console.log(`✅ Found ${tools.length} tools in database\n`);
  
  // Categorize tools by affiliate status
  const withLinks = tools.filter(t => t.affiliate_link && t.affiliate_link.length > 0 && t.affiliate_link !== t.website);
  const withoutLinks = tools.filter(t => !t.affiliate_link || t.affiliate_link.length === 0 || t.affiliate_link === t.website);
  
  // Group missing links by category
  const missingByCategory = {};
  withoutLinks.forEach(tool => {
    if (!missingByCategory[tool.category]) {
      missingByCategory[tool.category] = [];
    }
    missingByCategory[tool.category].push(tool);
  });
  
  // Calculate revenue potential
  const revenuePotential = calculateRevenuePotential(withoutLinks);
  
  console.log('📊 CURRENT AFFILIATE STATUS');
  console.log('===========================');
  console.log(`✅ Tools with affiliate links: ${withLinks.length}`);
  console.log(`❌ Tools missing affiliate links: ${withoutLinks.length}`);
  console.log(`📈 Coverage: ${Math.round((withLinks.length / tools.length) * 100)}%\n`);
  
  console.log('💰 REVENUE POTENTIAL (Missing Links)');
  console.log('====================================');
  console.log(`High-value tools: ${revenuePotential.high} ($${revenuePotential.monthlyRevenue.high}/mo)`);
  console.log(`Medium-value tools: ${revenuePotential.medium} ($${revenuePotential.monthlyRevenue.medium}/mo)`);
  console.log(`Low-value tools: ${revenuePotential.low} ($${revenuePotential.monthlyRevenue.low}/mo)`);
  console.log(`📊 Total potential: $${revenuePotential.total}/mo ($${revenuePotential.yearly}/year)\n`);
  
  // Top priority tools (high traffic categories)
  const highPriorityCategories = ['Productivity', 'Writing', 'Marketing', 'Video', 'Image'];
  const highPriorityMissing = withoutLinks.filter(t => highPriorityCategories.includes(t.category));
  
  console.log('🚨 TOP PRIORITY MISSING LINKS');
  console.log('=============================');
  highPriorityMissing.slice(0, 10).forEach((tool, i) => {
    const program = AFFILIATE_PROGRAMS[tool.name];
    const programInfo = program ? ` (${program.commission})` : ' (research needed)';
    console.log(`${i + 1}. ${tool.name} - ${tool.category}${programInfo}`);
  });
  
  // Export data for bulk processing
  const reportData = {
    summary: {
      total: tools.length,
      withLinks: withLinks.length,
      missingLinks: withoutLinks.length,
      coverage: Math.round((withLinks.length / tools.length) * 100),
      revenuePotential
    },
    missingByCategory,
    highPriorityMissing,
    affiliatePrograms: AFFILIATE_PROGRAMS,
    timestamp: new Date().toISOString()
  };
  
  // Fixed path issue - save to current directory
  const reportPath = path.join(process.cwd(), 'affiliate-bulk-report.json');
  await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
  console.log(`\n📄 Full report saved: ${reportPath}`);
  
  return reportData;
}

// Bulk update function for adding affiliate links
async function bulkUpdateAffiliateLinks(updates) {
  console.log('\n🔧 BULK AFFILIATE LINK UPDATE');
  console.log('=============================');
  
  for (const update of updates) {
    try {
      const result = await supabaseFetch(`tools?id=eq.${update.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          affiliate_link: update.affiliateUrl,
          commission_rate: update.commission
        }),
        headers: {
          'Prefer': 'return=representation'
        }
      });
      
      console.log(`✅ Updated: ${update.name} → ${update.affiliateUrl}`);
    } catch (error) {
      console.log(`❌ Failed: ${update.name} - ${error.message}`);
    }
  }
}

// Application tracker for affiliate programs
async function trackAffiliateApplications() {
  console.log('\n📝 AFFILIATE PROGRAM APPLICATION STATUS');
  console.log('======================================');
  
  const applications = {
    'Impact.com': { status: 'approved', tools: ['Grammarly', 'Notion', 'Canva', 'Zapier', 'Monday.com'] },
    'ShareASale': { status: 'pending', tools: ['ConvertKit', 'GetResponse'] },
    'CJ Affiliate': { status: 'not_applied', tools: ['Adobe Creative Suite'] },
    'Direct Programs': { status: 'mixed', tools: ['Synthesia ✅', 'ElevenLabs ✅', 'Pictory ⏸️'] }
  };
  
  Object.entries(applications).forEach(([program, data]) => {
    const statusIcon = data.status === 'approved' ? '✅' : 
                      data.status === 'pending' ? '⏸️' : '❌';
    console.log(`${statusIcon} ${program}: ${data.status}`);
    data.tools.forEach(tool => console.log(`   - ${tool}`));
  });
  
  return applications;
}

// Main command processor
async function main() {
  const command = process.argv[2] || 'audit';
  
  try {
    switch (command) {
      case 'audit':
        await auditAffiliateLinks();
        break;
        
      case 'applications':
        await trackAffiliateApplications();
        break;
        
      case 'revenue':
        const audit = await auditAffiliateLinks();
        console.log('\n💎 REVENUE OPPORTUNITY BREAKDOWN');
        console.log('================================');
        console.log(`Current earning: $0/mo`);
        console.log(`With all affiliate links: $${audit.summary.revenuePotential.total}/mo`);
        console.log(`Break-even at: $259/mo (current costs)`);
        console.log(`Net profit potential: $${audit.summary.revenuePotential.total - 259}/mo`);
        break;
        
      case 'priorities':
        const data = await auditAffiliateLinks();
        console.log('\n🎯 TOP 20 PRIORITY TOOLS FOR AFFILIATE LINKS');
        console.log('===========================================');
        data.highPriorityMissing.slice(0, 20).forEach((tool, i) => {
          const program = AFFILIATE_PROGRAMS[tool.name] || { commission: 'TBD', program: 'Research' };
          console.log(`${(i + 1).toString().padStart(2)}. ${tool.name.padEnd(25)} | ${tool.category.padEnd(12)} | ${program.commission}`);
        });
        break;
        
      default:
        console.log('Usage: node affiliate-bulk-manager.js [audit|applications|revenue|priorities]');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { auditAffiliateLinks, bulkUpdateAffiliateLinks, trackAffiliateApplications };