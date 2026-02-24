#!/usr/bin/env node

/**
 * AFFILIATE APPLICATION PLANNER
 * 
 * Generates actionable step-by-step application plan for Matt.
 * Creates prioritized to-do list with exact URLs and deadlines.
 * 
 * Usage: node affiliate-planner.js
 * Requires: opportunity-matrix.json (run affiliate-matcher.js first)
 */

const fs = require('fs').promises;

// Application templates for different scenarios
const APPLICATION_TEMPLATES = {
  saasAffiliate: {
    subject: "Partnership Inquiry - AI Tools Directory",
    body: `Hi [COMPANY] Team,

I run AI Tools HQ (ai-tools-hq.com), an AI tools directory that helps users discover and compare AI solutions. We feature [TOOL_NAME] in our directory and would like to join your affiliate program.

Our site focuses on:
- Detailed tool reviews and comparisons
- SEO-optimized content targeting long-tail keywords
- Audience of developers, marketers, and business owners exploring AI tools

Site stats:
- 10,000+ tools evaluated
- Growing organic traffic targeting AI tool keywords
- Professional content with detailed reviews

We believe [TOOL_NAME] would be valuable to our audience and would love to become an affiliate partner.

Could you please provide information about your affiliate program or direct me to the application process?

Best regards,
Matt Morales
Founder, AI Tools HQ
Email: mpm.morales@gmail.com
Website: ai-tools-hq.com`
  },
  
  networkApplication: {
    subject: "Publisher Application - AI Tools Directory",
    body: `Hi [NETWORK] Team,

I'm applying to join [NETWORK] as a publisher for my AI tools directory site.

Site: AI Tools HQ (ai-tools-hq.com)
Niche: AI tools reviews and comparisons
Content: Professional reviews, detailed tool comparisons, buying guides
Audience: Developers, marketers, business owners exploring AI solutions
Traffic: Growing organic traffic, targeting commercial AI tool keywords

I'm specifically interested in promoting AI/SaaS tools in these categories:
- Writing and content creation tools
- Video and image generation tools
- Productivity and automation tools
- Design and creative tools

Looking forward to joining your network.

Best regards,
Matt Morales
mpm.morales@gmail.com`
  }
};

async function generateApplicationPlan() {
  console.log('📋 AFFILIATE APPLICATION PLANNER');
  console.log('=================================\n');
  
  try {
    const reportData = await fs.readFile('ai-tools-hq/affiliate-management/opportunity-matrix.json', 'utf8');
    const opportunityMatrix = JSON.parse(reportData);
    
    console.log(`📊 Planning applications for ${opportunityMatrix.totalOpportunities} opportunities...\n`);
    
    const plan = createDetailedPlan(opportunityMatrix);
    const timeline = createTimeline(plan);
    const templates = createApplicationTemplates(plan);
    
    // Generate comprehensive plan
    const fullPlan = {
      generatedAt: new Date().toISOString(),
      deadline: '2026-02-07',
      daysRemaining: Math.ceil((new Date('2026-02-07') - new Date()) / (1000 * 60 * 60 * 24)),
      summary: {
        totalApplications: plan.immediateApplications.length + plan.weeklyApplications.length,
        estimatedRevenue: opportunityMatrix.estimatedTotalRevenue,
        timeToComplete: calculateTimeToComplete(plan)
      },
      actionPlan: plan,
      timeline: timeline,
      applicationTemplates: templates,
      trackingSpreadsheet: createTrackingSpreadsheet(plan)
    };
    
    // Print action plan
    printActionPlan(fullPlan);
    
    // Save comprehensive plan
    const planPath = 'ai-tools-hq/affiliate-management/application-plan.json';
    await fs.writeFile(planPath, JSON.stringify(fullPlan, null, 2));
    console.log(`💾 Complete plan saved to: ${planPath}`);
    
    // Save Matt's to-do list
    await saveMattsTodoList(fullPlan);
    
    return fullPlan;
    
  } catch (err) {
    console.error('❌ Error loading opportunity matrix:', err.message);
    console.log('💡 Run affiliate-matcher.js first to generate the opportunity matrix.');
    return null;
  }
}

function createDetailedPlan(opportunityMatrix) {
  const plan = opportunityMatrix.applicationPlan;
  
  // Immediate applications (apply today)
  const immediateApplications = plan.immediate.map(opp => ({
    priority: 1,
    toolName: opp.toolName,
    program: opp.match.program,
    commission: opp.match.commission,
    applicationUrl: opp.match.url,
    estimatedRevenue: opp.estimatedRevenue,
    timeEstimate: '15 minutes',
    category: opp.category,
    action: 'Apply directly',
    notes: `High priority - ${opp.match.commission}`
  }));
  
  // Weekly applications
  const weeklyApplications = plan.thisWeek.map(opp => ({
    priority: 2,
    toolName: opp.toolName,
    program: opp.match.program,
    commission: opp.match.commission || 'TBD',
    applicationUrl: opp.match.url || 'Research needed',
    estimatedRevenue: opp.estimatedRevenue,
    timeEstimate: '20 minutes',
    category: opp.category,
    action: getActionType(opp.match),
    notes: getApplicationNotes(opp.match)
  }));
  
  // Research needed
  const researchNeeded = plan.research.map(opp => ({
    priority: 3,
    toolName: opp.toolName,
    program: 'Research needed',
    estimatedRevenue: opp.estimatedRevenue,
    timeEstimate: '30 minutes',
    category: opp.category,
    action: 'Research affiliate program',
    notes: `Check ${opp.toolWebsite} for affiliate/partner pages`
  }));
  
  return {
    immediateApplications,
    weeklyApplications,
    researchNeeded,
    networkApplications: createNetworkApplications(opportunityMatrix)
  };
}

function createNetworkApplications(opportunityMatrix) {
  const networks = [
    { 
      name: 'Impact.com',
      url: 'impact.com',
      tools: [],
      priority: 1,
      timeEstimate: '30 minutes',
      expectedApproval: '3-5 days'
    },
    {
      name: 'PartnerStack',
      url: 'partnerstack.com', 
      tools: [],
      priority: 2,
      timeEstimate: '25 minutes',
      expectedApproval: '1-3 days'
    },
    {
      name: 'ShareASale',
      url: 'shareasale.com',
      tools: [],
      priority: 3,
      timeEstimate: '20 minutes',
      expectedApproval: '1-7 days'
    }
  ];
  
  // Add tools that should go through networks
  opportunityMatrix.opportunities.forEach(opp => {
    if (opp.match.type === 'network') {
      const networkName = opp.match.program.split('(')[0].trim();
      const network = networks.find(n => n.name === networkName);
      if (network) {
        network.tools.push(opp.toolName);
      }
    }
  });
  
  return networks.filter(n => n.tools.length > 0);
}

function createTimeline(plan) {
  const today = new Date();
  const timeline = [];
  
  // Day 1 (Today)
  if (plan.immediateApplications.length > 0) {
    timeline.push({
      date: formatDate(today),
      day: 'Today',
      tasks: plan.immediateApplications.slice(0, 5), // Max 5 per day
      totalTime: plan.immediateApplications.slice(0, 5).length * 15 + ' minutes'
    });
  }
  
  // Day 2-3 (This week)
  const day2 = new Date(today);
  day2.setDate(today.getDate() + 1);
  
  timeline.push({
    date: formatDate(day2),
    day: 'Tomorrow',
    tasks: [...plan.immediateApplications.slice(5), ...plan.weeklyApplications.slice(0, 3)],
    totalTime: 'est. 60 minutes'
  });
  
  // Network applications
  const day3 = new Date(today);
  day3.setDate(today.getDate() + 2);
  
  if (plan.networkApplications.length > 0) {
    timeline.push({
      date: formatDate(day3),
      day: 'Day 3',
      tasks: plan.networkApplications,
      totalTime: 'est. 75 minutes'
    });
  }
  
  return timeline;
}

function createApplicationTemplates(plan) {
  const templates = {};
  
  // Individual program templates
  plan.immediateApplications.forEach(app => {
    templates[app.program] = APPLICATION_TEMPLATES.saasAffiliate.body
      .replace('[TOOL_NAME]', app.toolName)
      .replace('[COMPANY]', app.program);
  });
  
  // Network templates
  plan.networkApplications.forEach(network => {
    templates[network.name] = APPLICATION_TEMPLATES.networkApplication.body
      .replace(/\[NETWORK\]/g, network.name);
  });
  
  return templates;
}

function createTrackingSpreadsheet(plan) {
  const rows = [
    ['Tool Name', 'Program', 'Commission', 'Application URL', 'Status', 'Applied Date', 'Response Date', 'Notes']
  ];
  
  // Add immediate applications
  plan.immediateApplications.forEach(app => {
    rows.push([
      app.toolName,
      app.program,
      app.commission,
      app.applicationUrl,
      'Not Applied',
      '',
      '',
      app.notes
    ]);
  });
  
  // Add weekly applications
  plan.weeklyApplications.forEach(app => {
    rows.push([
      app.toolName,
      app.program,
      app.commission || 'TBD',
      app.applicationUrl || 'Research needed',
      'Not Applied',
      '',
      '',
      app.notes
    ]);
  });
  
  return {
    filename: 'affiliate-applications-tracker.csv',
    headers: rows[0],
    data: rows.slice(1)
  };
}

function calculateTimeToComplete(plan) {
  const immediate = plan.immediateApplications.length * 15;
  const weekly = plan.weeklyApplications.length * 20;
  const networks = plan.networkApplications.length * 30;
  const research = plan.researchNeeded.length * 30;
  
  return Math.ceil((immediate + weekly + networks + research) / 60) + ' hours';
}

function getActionType(match) {
  if (match.url && match.url !== 'No public program') {
    return 'Direct application';
  } else if (match.type === 'network') {
    return 'Apply via network';
  } else {
    return 'Research needed';
  }
}

function getApplicationNotes(match) {
  const notes = [];
  
  if (match.commission) notes.push(`Commission: ${match.commission}`);
  if (match.cookie) notes.push(`Cookie: ${match.cookie}`);
  if (match.tier === 1) notes.push('🔥 High priority');
  if (match.tier === 2) notes.push('📍 Medium priority');
  if (match.tier >= 3) notes.push('📋 Lower priority');
  
  return notes.join(' | ');
}

function printActionPlan(plan) {
  console.log('🎯 ACTION PLAN FOR MATT');
  console.log('=======================\n');
  
  console.log(`⏰ Deadline: ${plan.deadline} (${plan.daysRemaining} days remaining)`);
  console.log(`⚡ Total applications: ${plan.summary.totalApplications}`);
  console.log(`💰 Revenue potential: $${plan.summary.estimatedRevenue}/month`);
  console.log(`⏱️  Time to complete: ${plan.summary.timeToComplete}\n`);
  
  console.log('🔥 APPLY TODAY (High Priority):');
  console.log('===============================');
  plan.actionPlan.immediateApplications.slice(0, 5).forEach((app, i) => {
    console.log(`${i + 1}. ${app.toolName} → ${app.program}`);
    console.log(`   💰 ${app.commission} | ⏱️ ${app.timeEstimate} | 🔗 ${app.applicationUrl}`);
  });
  
  console.log('\n📅 THIS WEEK:');
  console.log('=============');
  plan.actionPlan.weeklyApplications.slice(0, 5).forEach((app, i) => {
    console.log(`${i + 1}. ${app.toolName} → ${app.program} (${app.action})`);
  });
  
  console.log('\n🌐 NETWORK APPLICATIONS:');
  console.log('========================');
  plan.actionPlan.networkApplications.forEach((network, i) => {
    console.log(`${i + 1}. ${network.name} - ${network.tools.length} tools (${network.timeEstimate})`);
  });
  
  console.log('\n📈 EXPECTED TIMELINE:');
  console.log('=====================');
  plan.timeline.forEach(day => {
    console.log(`📅 ${day.day} (${day.date}): ${day.tasks.length} applications (${day.totalTime})`);
  });
  
  console.log('\n✅ NEXT STEPS:');
  console.log('==============');
  console.log('1. Open affiliate-applications-tracker.csv to track progress');
  console.log('2. Start with immediate applications (highest revenue)');
  console.log('3. Use email templates in application-plan.json');
  console.log('4. Update tracker with application status');
  console.log('5. Follow up on pending applications after 5-7 days\n');
}

async function saveMattsTodoList(plan) {
  const todoPath = 'ai-tools-hq/affiliate-management/MATT-TODO-LIST.md';
  
  const todoContent = `# 🎯 MATT'S AFFILIATE TODO LIST
**Generated:** ${new Date().toLocaleDateString()}
**Deadline:** Feb 7, 2026 (${plan.daysRemaining} days left!)

## ⚡ APPLY TODAY (15 min each)

${plan.actionPlan.immediateApplications.slice(0, 5).map((app, i) => 
`### ${i + 1}. ${app.toolName} → ${app.program}
- **Commission:** ${app.commission}
- **URL:** ${app.applicationUrl}
- **Revenue potential:** $${app.estimatedRevenue}/month
- **Time:** ${app.timeEstimate}
- [ ] Applied
- [ ] Response received
`).join('\n')}

## 📅 THIS WEEK (20 min each)

${plan.actionPlan.weeklyApplications.slice(0, 5).map((app, i) => 
`### ${i + 1}. ${app.toolName} → ${app.program}
- **Action:** ${app.action}
- **URL:** ${app.applicationUrl || 'Research needed'}
- **Revenue potential:** $${app.estimatedRevenue}/month
- [ ] Applied
- [ ] Response received
`).join('\n')}

## 🌐 NETWORK APPLICATIONS (30 min each)

${plan.actionPlan.networkApplications.map((network, i) => 
`### ${i + 1}. ${network.name}
- **Tools:** ${network.tools.slice(0, 3).join(', ')}${network.tools.length > 3 ? '...' : ''}
- **URL:** ${network.url}
- **Expected approval:** ${network.expectedApproval}
- [ ] Applied
- [ ] Approved
`).join('\n')}

## 📊 TRACKING

**Total Revenue Potential:** $${plan.summary.estimatedRevenue}/month
**Total Time Investment:** ${plan.summary.timeToComplete}
**Applications to Complete:** ${plan.summary.totalApplications}

Use \`affiliate-applications-tracker.csv\` to track all applications.

---
**Remember:** Each affiliate link = passive revenue. Do this once, earn forever! 🚀`;

  await fs.writeFile(todoPath, todoContent);
  console.log(`📝 Matt's todo list saved to: ${todoPath}`);
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Run if called directly
if (require.main === module) {
  generateApplicationPlan().catch(console.error);
}

module.exports = { generateApplicationPlan };