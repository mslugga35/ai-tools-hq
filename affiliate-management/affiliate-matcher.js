#!/usr/bin/env node

/**
 * AFFILIATE OPPORTUNITY MATCHER
 * 
 * Matches tools missing affiliate links against known affiliate programs.
 * Creates prioritized application plan for maximum revenue impact.
 * 
 * Usage: node affiliate-matcher.js
 * Requires: affiliate-audit-report.json (run affiliate-audit.js first)
 */

const fs = require('fs').promises;

// Known affiliate programs from AFFILIATE-PROGRAMS.md
const KNOWN_PROGRAMS = {
  // Tier 1: High Priority
  'jasper': { commission: '30% recurring', cookie: '30 days', url: 'jasper.ai/partners', tier: 1, priority: 10 },
  'copy.ai': { commission: '45% first year', cookie: '90 days', url: 'copy.ai/affiliates', tier: 1, priority: 10 },
  'writesonic': { commission: '30% recurring', cookie: '60 days', url: 'writesonic.com/affiliates', tier: 1, priority: 9 },
  'pictory': { commission: '30% recurring', cookie: '30 days', url: 'pictory.ai/affiliates', tier: 1, priority: 9 },
  'synthesia': { commission: '20% recurring', cookie: '30 days', url: 'synthesia.io/partners', tier: 1, priority: 9 },
  
  // Tier 2: Medium Priority  
  'descript': { commission: '15% recurring', cookie: '30 days', url: 'descript.com/affiliates', tier: 2, priority: 7 },
  'notion': { commission: '$10 per signup', cookie: '90 days', url: 'notion.so/affiliates', tier: 2, priority: 6 },
  'canva': { commission: '$36 per sub', cookie: '30 days', url: 'canva.com/affiliates', tier: 2, priority: 8 },
  'grammarly': { commission: '$20 per signup', cookie: '90 days', url: 'grammarly.com/affiliates', tier: 2, priority: 7 },
  'murf.ai': { commission: '25% recurring', cookie: '30 days', url: 'murf.ai/affiliates', tier: 2, priority: 7 },
  
  // Tier 3: Lower Priority
  'surfer seo': { commission: '25% recurring', cookie: '60 days', url: 'surferseo.com/affiliates', tier: 3, priority: 5 },
  'frase': { commission: '30% recurring', cookie: '60 days', url: 'frase.io/affiliates', tier: 3, priority: 5 },
  'heygen': { commission: '20% recurring', cookie: '30 days', url: 'heygen.com/affiliates', tier: 3, priority: 6 },
  'elevenlabs': { commission: '22% recurring', cookie: '30 days', url: 'elevenlabs.io/affiliates', tier: 3, priority: 6 },
  'runway': { commission: '15% recurring', cookie: '30 days', url: 'runwayml.com/affiliates', tier: 3, priority: 4 },
  
  // Additional common tools
  'openai': { commission: 'Unknown', cookie: 'N/A', url: 'No public program', tier: 4, priority: 1 },
  'anthropic': { commission: 'Unknown', cookie: 'N/A', url: 'No public program', tier: 4, priority: 1 },
  'midjourney': { commission: 'Unknown', cookie: 'N/A', url: 'No public program', tier: 4, priority: 2 },
  'stable diffusion': { commission: 'Various', cookie: 'Various', url: 'Multiple providers', tier: 3, priority: 3 },
};

// Affiliate networks for tools without direct programs
const AFFILIATE_NETWORKS = [
  { name: 'Impact.com', url: 'impact.com', notes: 'Enterprise SaaS tools', priority: 8 },
  { name: 'PartnerStack', url: 'partnerstack.com', notes: 'Many SaaS tools', priority: 7 },
  { name: 'ShareASale', url: 'shareasale.com', notes: 'Large marketplace', priority: 6 },
  { name: 'CJ Affiliate', url: 'cj.com', notes: 'Established brands', priority: 5 },
];

function matchToolToProgram(toolName, toolWebsite, toolDescription = '') {
  const searchText = `${toolName} ${toolWebsite} ${toolDescription}`.toLowerCase();
  
  // Direct name matches
  for (const [programName, programData] of Object.entries(KNOWN_PROGRAMS)) {
    if (searchText.includes(programName.toLowerCase())) {
      return { type: 'direct', program: programName, ...programData };
    }
  }
  
  // Partial matches and synonyms
  const matches = [
    { keywords: ['jasper', 'jarvis'], program: 'jasper' },
    { keywords: ['copy.ai', 'copyai'], program: 'copy.ai' },
    { keywords: ['writesonic', 'sonic'], program: 'writesonic' },
    { keywords: ['pictory'], program: 'pictory' },
    { keywords: ['synthesia'], program: 'synthesia' },
    { keywords: ['descript'], program: 'descript' },
    { keywords: ['notion'], program: 'notion' },
    { keywords: ['canva'], program: 'canva' },
    { keywords: ['grammarly'], program: 'grammarly' },
    { keywords: ['murf', 'murf.ai'], program: 'murf.ai' },
    { keywords: ['elevenlabs', 'eleven labs'], program: 'elevenlabs' },
    { keywords: ['heygen'], program: 'heygen' },
    { keywords: ['runway', 'runwayml'], program: 'runway' },
  ];
  
  for (const match of matches) {
    if (match.keywords.some(keyword => searchText.includes(keyword))) {
      const programData = KNOWN_PROGRAMS[match.program];
      return { type: 'partial', program: match.program, ...programData };
    }
  }
  
  // Category-based network recommendations
  if (searchText.includes('video') || searchText.includes('animation')) {
    return { type: 'network', program: 'Impact.com (Video/Creative)', tier: 2, priority: 6 };
  }
  
  if (searchText.includes('writing') || searchText.includes('content')) {
    return { type: 'network', program: 'PartnerStack (Content Tools)', tier: 2, priority: 7 };
  }
  
  if (searchText.includes('design') || searchText.includes('graphic')) {
    return { type: 'network', program: 'ShareASale (Design Tools)', tier: 2, priority: 6 };
  }
  
  // Default to manual research
  return { type: 'research', program: 'Manual research needed', tier: 3, priority: 3 };
}

async function generateOpportunityMatrix() {
  console.log('🎯 AFFILIATE OPPORTUNITY MATCHER');
  console.log('=================================\n');
  
  // Load audit report
  try {
    const reportData = await fs.readFile('ai-tools-hq/affiliate-management/affiliate-audit-report.json', 'utf8');
    const auditReport = JSON.parse(reportData);
    
    console.log(`📊 Processing ${auditReport.summary.toolsMissingLinks} tools missing affiliate links...\n`);
    
    const opportunities = [];
    const programCounts = {};
    
    // Process tools by category
    for (const [category, categoryData] of Object.entries(auditReport.categories)) {
      if (categoryData.missing === 0) continue;
      
      console.log(`📁 Processing ${category} (${categoryData.missing} tools)...`);
      
      for (const tool of categoryData.tools) {
        const match = matchToolToProgram(tool.name, tool.website, tool.description);
        
        const opportunity = {
          toolId: tool.id,
          toolName: tool.name,
          toolSlug: tool.slug,
          toolWebsite: tool.website,
          category: category,
          match: match,
          estimatedRevenue: calculateRevenueEstimate(match),
          actionRequired: getActionRequired(match)
        };
        
        opportunities.push(opportunity);
        
        // Count program matches
        const programKey = match.program || 'Unknown';
        programCounts[programKey] = (programCounts[programKey] || 0) + 1;
      }
    }
    
    // Sort by priority and estimated revenue
    opportunities.sort((a, b) => {
      const priorityDiff = (b.match.priority || 0) - (a.match.priority || 0);
      if (priorityDiff !== 0) return priorityDiff;
      
      const revenueDiff = (b.estimatedRevenue || 0) - (a.estimatedRevenue || 0);
      return revenueDiff;
    });
    
    // Generate application plan
    const applicationPlan = generateApplicationPlan(opportunities);
    
    // Create final report
    const report = {
      generatedAt: new Date().toISOString(),
      totalOpportunities: opportunities.length,
      programCounts: programCounts,
      opportunities: opportunities,
      applicationPlan: applicationPlan,
      estimatedTotalRevenue: opportunities.reduce((sum, opp) => sum + (opp.estimatedRevenue || 0), 0)
    };
    
    // Print summary
    console.log('\n📊 OPPORTUNITY SUMMARY');
    console.log('======================');
    console.log(`🎯 Total opportunities: ${report.totalOpportunities}`);
    console.log(`💰 Estimated monthly revenue potential: $${report.estimatedTotalRevenue}`);
    
    console.log('\n🏆 TOP PRIORITY APPLICATIONS:');
    opportunities.slice(0, 10).forEach((opp, i) => {
      console.log(`${i + 1}. ${opp.toolName} → ${opp.match.program} (${opp.match.commission || 'TBD'})`);
    });
    
    console.log('\n📋 MOST COMMON PROGRAMS:');
    Object.entries(programCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([program, count]) => {
        console.log(`   ${program}: ${count} tools`);
      });
    
    // Save report
    const reportPath = 'ai-tools-hq/affiliate-management/opportunity-matrix.json';
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Full report saved to: ${reportPath}`);
    
    return report;
    
  } catch (err) {
    console.error('❌ Error loading audit report:', err.message);
    console.log('💡 Run affiliate-audit.js first to generate the audit report.');
    return null;
  }
}

function calculateRevenueEstimate(match) {
  // Rough monthly revenue estimates based on commission and tool popularity
  const estimates = {
    'jasper': 150, 'copy.ai': 200, 'writesonic': 120, 'synthesia': 180,
    'pictory': 100, 'canva': 80, 'notion': 60, 'grammarly': 40,
    'descript': 90, 'murf.ai': 70, 'elevenlabs': 85, 'heygen': 110
  };
  
  return estimates[match.program] || (match.tier === 1 ? 100 : match.tier === 2 ? 60 : 30);
}

function getActionRequired(match) {
  switch (match.type) {
    case 'direct':
      return `Apply directly at ${match.url}`;
    case 'partial':
      return `Apply directly at ${match.url}`;
    case 'network':
      return `Research on ${match.program}`;
    case 'research':
      return 'Manual research needed - check tool website for affiliate info';
    default:
      return 'Unknown';
  }
}

function generateApplicationPlan(opportunities) {
  const plan = {
    immediate: [], // Apply today
    thisWeek: [], // Apply this week
    nextWeek: [], // Apply next week
    research: []  // Needs research first
  };
  
  for (const opp of opportunities) {
    if (opp.match.tier === 1 && opp.match.priority >= 9) {
      plan.immediate.push(opp);
    } else if (opp.match.tier <= 2 && opp.match.priority >= 6) {
      plan.thisWeek.push(opp);
    } else if (opp.match.tier <= 3 && opp.match.priority >= 4) {
      plan.nextWeek.push(opp);
    } else {
      plan.research.push(opp);
    }
  }
  
  return plan;
}

// Run if called directly
if (require.main === module) {
  generateOpportunityMatrix().catch(console.error);
}

module.exports = { generateOpportunityMatrix, matchToolToProgram };