#!/usr/bin/env node

/**
 * AFFILIATE PROGRAM RESEARCHER
 * 
 * Automatically research affiliate programs for top AI tools
 * 
 * Usage: node research-programs.js [tool-name]
 * 
 * Built: 2026-02-10 by Damian
 */

const fs = require('fs').promises;

// Top priority tools for affiliate research
const TOP_TOOLS = [
  "Grammarly",
  "Canva AI", 
  "Jasper",
  "Copy.ai",
  "Notion AI",
  "Midjourney",
  "GitHub Copilot",
  "Adobe Firefly",
  "Descript",
  "Surfer SEO",
  "QuillBot",
  "Pictory",
  "InVideo",
  "ChatGPT",
  "Claude"
];

// Common affiliate program patterns
const PROGRAM_PATTERNS = {
  direct: [
    "{domain}/affiliate",
    "{domain}/partners", 
    "{domain}/referral",
    "{domain}/partner-program",
    "partner.{domain}",
    "affiliate.{domain}"
  ],
  networks: [
    "Impact.com",
    "ShareASale", 
    "Commission Junction (CJ)",
    "PartnerStack",
    "ClickBank",
    "Amazon Associates"
  ]
};

async function generateResearchPlan() {
  console.log('🔍 AI TOOLS AFFILIATE RESEARCH PLAN');
  console.log('===================================\n');
  
  const research = [];
  
  for (const tool of TOP_TOOLS) {
    const plan = {
      tool: tool,
      searches: [
        `"${tool}" affiliate program`,
        `"${tool}" partner program`,
        `"${tool}" referral program`,
        `site:impact.com "${tool}"`,
        `site:shareasale.com "${tool}"`,
        `site:cj.com "${tool}"`
      ],
      directLinks: [],
      expectedCommission: "15-30%",
      priority: "High"
    };
    
    // Add direct website checks
    const domain = tool.toLowerCase().replace(/\s+/g, '').replace(/ai$/i, '');
    PROGRAM_PATTERNS.direct.forEach(pattern => {
      plan.directLinks.push(pattern.replace('{domain}', `${domain}.com`));
    });
    
    research.push(plan);
  }
  
  // Save research plan
  await fs.writeFile(
    'affiliate-research-plan.json', 
    JSON.stringify(research, null, 2)
  );
  
  console.log('📋 Research plan generated for top 15 tools');
  console.log('💾 Saved: affiliate-research-plan.json\n');
  
  // Show first few as example
  console.log('🎯 QUICK RESEARCH TASKS:');
  console.log('========================\n');
  
  research.slice(0, 5).forEach((item, i) => {
    console.log(`${i+1}. ${item.tool}`);
    console.log(`   • Search: "${item.tool}" affiliate program`);
    console.log(`   • Check: ${item.directLinks[0]}`);
    console.log(`   • Networks: Impact.com, ShareASale`);
    console.log('');
  });
  
  console.log('💡 TIP: Research 2-3 tools per day to avoid overwhelm');
  console.log('🎯 GOAL: Find affiliate programs with 20%+ commission rates');
  
  return research;
}

async function researchSingleTool(toolName) {
  console.log(`🔍 RESEARCHING: ${toolName}`);
  console.log('='.repeat(20 + toolName.length) + '\n');
  
  const domain = toolName.toLowerCase().replace(/\s+/g, '').replace(/ai$/i, '');
  
  console.log('🌐 DIRECT PROGRAM CHECKS:');
  PROGRAM_PATTERNS.direct.forEach(pattern => {
    const url = pattern.replace('{domain}', `${domain}.com`);
    console.log(`   • ${url}`);
  });
  
  console.log('\n🔍 SEARCH QUERIES:');
  console.log(`   • "${toolName}" affiliate program`);
  console.log(`   • "${toolName}" partner program`);
  console.log(`   • site:impact.com "${toolName}"`);
  console.log(`   • site:shareasale.com "${toolName}"`);
  
  console.log('\n📋 RESEARCH CHECKLIST:');
  console.log('   [ ] Check direct website affiliate page');
  console.log('   [ ] Search Impact.com merchant directory');
  console.log('   [ ] Search ShareASale merchant list'); 
  console.log('   [ ] Google for "[tool] affiliate program"');
  console.log('   [ ] Check if tool has API/integration partnerships');
  console.log('   [ ] Look for competitor affiliate programs');
  
  console.log('\n💰 WHAT TO LOOK FOR:');
  console.log('   • Commission rate (aim for 20%+)');
  console.log('   • Cookie duration (30+ days preferred)');
  console.log('   • Approval requirements');
  console.log('   • Payment terms');
  console.log('   • Marketing materials provided');
  
  console.log('\n📝 NEXT STEPS:');
  console.log('   1. Find affiliate program');
  console.log('   2. Note commission rate and terms');
  console.log('   3. Apply if requirements met');
  console.log('   4. Add to tracking spreadsheet');
  console.log('   5. Update ai-tools-hq when approved');
}

async function main() {
  const toolName = process.argv[2];
  
  if (toolName) {
    await researchSingleTool(toolName);
  } else {
    await generateResearchPlan();
  }
}

if (require.main === module) {
  main().catch(console.error);
}