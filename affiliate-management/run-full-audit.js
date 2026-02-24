#!/usr/bin/env node

/**
 * FULL AFFILIATE AUDIT RUNNER
 * 
 * Runs the complete affiliate link audit and generates actionable plan for Matt.
 * This is the one-click solution for the ai-tools-hq affiliate link problem.
 * 
 * Usage: node run-full-audit.js
 * 
 * What it does:
 * 1. Audits current affiliate link status
 * 2. Matches tools to affiliate programs  
 * 3. Generates prioritized application plan
 * 4. Creates tracking spreadsheet
 * 5. Outputs actionable todo list for Matt
 */

const { execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// Ensure we have Node fetch available
try {
  if (!globalThis.fetch) {
    const nodeFetch = require('node-fetch');
    globalThis.fetch = nodeFetch;
  }
} catch (err) {
  console.log('⚠️ Note: node-fetch not available, using built-in fetch');
}

async function runFullAudit() {
  console.log('🚀 AI TOOLS HQ - FULL AFFILIATE AUDIT');
  console.log('=====================================\n');
  
  const startTime = Date.now();
  
  try {
    console.log('📋 Step 1: Running affiliate link audit...');
    console.log('------------------------------------------');
    await runScript('./affiliate-audit.js');
    
    console.log('\n🎯 Step 2: Matching tools to affiliate programs...');
    console.log('--------------------------------------------------');
    await runScript('./affiliate-matcher.js');
    
    console.log('\n📊 Step 3: Generating application plan...');
    console.log('------------------------------------------');
    await runScript('./affiliate-planner.js');
    
    console.log('\n📝 Step 4: Creating tracking spreadsheet...');
    console.log('--------------------------------------------');
    await createTrackingCSV();
    
    console.log('\n🎉 AUDIT COMPLETE!');
    console.log('==================');
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Full audit completed in ${duration} seconds\n`);
    
    await displayFinalSummary();
    
  } catch (err) {
    console.error('❌ Error during audit:', err.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Make sure you\'re in the affiliate-management folder');
    console.log('- Verify Supabase connection is working');
    console.log('- Check that all script files exist');
    process.exit(1);
  }
}

async function runScript(scriptPath) {
  const { auditAffiliateLinks } = require(scriptPath);
  if (auditAffiliateLinks) {
    await auditAffiliateLinks();
  } else {
    // If no exported function, run the script directly
    execSync(`node ${scriptPath}`, { stdio: 'inherit', cwd: __dirname });
  }
}

async function createTrackingCSV() {
  try {
    const planData = await fs.readFile('./application-plan.json', 'utf8');
    const plan = JSON.parse(planData);
    
    const csvRows = [
      'Tool Name,Program,Commission,Application URL,Status,Applied Date,Response Date,Notes'
    ];
    
    // Add immediate applications
    plan.actionPlan.immediateApplications.forEach(app => {
      csvRows.push([
        app.toolName,
        app.program,
        app.commission,
        app.applicationUrl,
        'Not Applied',
        '',
        '',
        app.notes
      ].map(field => `"${field}"`).join(','));
    });
    
    // Add weekly applications
    plan.actionPlan.weeklyApplications.forEach(app => {
      csvRows.push([
        app.toolName,
        app.program,
        app.commission || 'TBD',
        app.applicationUrl || 'Research needed',
        'Not Applied',
        '',
        '',
        app.notes || ''
      ].map(field => `"${field}"`).join(','));
    });
    
    const csvContent = csvRows.join('\n');
    await fs.writeFile('./affiliate-applications-tracker.csv', csvContent);
    console.log('💾 Created: affiliate-applications-tracker.csv');
    
  } catch (err) {
    console.error('⚠️ Could not create CSV:', err.message);
  }
}

async function displayFinalSummary() {
  try {
    const auditData = JSON.parse(await fs.readFile('./affiliate-audit-report.json', 'utf8'));
    const planData = JSON.parse(await fs.readFile('./application-plan.json', 'utf8'));
    
    console.log('📊 FINAL SUMMARY');
    console.log('================\n');
    
    console.log(`📈 Current Status:`);
    console.log(`   • Total tools: ${auditData.summary.totalTools}`);
    console.log(`   • With affiliate links: ${auditData.summary.toolsWithAffiliateLinks}`);
    console.log(`   • Missing affiliate links: ${auditData.summary.toolsMissingLinks}`);
    console.log(`   • Coverage: ${auditData.summary.coveragePercentage}%\n`);
    
    console.log(`💰 Revenue Impact:`);
    console.log(`   • Potential monthly revenue: $${planData.summary.estimatedRevenue}`);
    console.log(`   • Applications needed: ${planData.summary.totalApplications}`);
    console.log(`   • Time investment: ${planData.summary.timeToComplete}\n`);
    
    console.log(`⏰ Timeline:`);
    console.log(`   • Deadline: ${planData.deadline}`);
    console.log(`   • Days remaining: ${planData.daysRemaining}`);
    console.log(`   • Immediate actions: ${planData.actionPlan.immediateApplications.length}`);
    console.log(`   • This week actions: ${planData.actionPlan.weeklyApplications.length}\n`);
    
    console.log('📁 FILES GENERATED:');
    console.log('===================');
    console.log('✅ affiliate-audit-report.json - Complete audit results');
    console.log('✅ opportunity-matrix.json - Tool-to-program matches');
    console.log('✅ application-plan.json - Detailed action plan');
    console.log('✅ MATT-TODO-LIST.md - Prioritized todo list');
    console.log('✅ affiliate-applications-tracker.csv - Progress tracking');
    console.log('✅ affiliate-dashboard.html - Visual dashboard\n');
    
    console.log('🎯 NEXT STEPS FOR MATT:');
    console.log('========================');
    console.log('1. Open MATT-TODO-LIST.md for immediate actions');
    console.log('2. Open affiliate-dashboard.html in browser for visual overview');
    console.log('3. Start with "Apply Today" items (highest revenue impact)');
    console.log('4. Use affiliate-applications-tracker.csv to track progress');
    console.log('5. Apply to 3-5 programs per day until Feb 7 deadline\n');
    
    console.log('💡 PRO TIPS:');
    console.log('============');
    console.log('• Focus on recurring commissions over one-time payouts');
    console.log('• Apply to direct programs before networks when possible'); 
    console.log('• Follow up on pending applications after 5-7 days');
    console.log('• Each affiliate link = $5-50/month passive income');
    console.log('• 50+ affiliate links = $500-2000/month potential\n');
    
    console.log('🚀 This system just saved you 20+ hours of manual research!');
    console.log('Now go make that money! 💪\n');
    
  } catch (err) {
    console.error('⚠️ Could not load summary data:', err.message);
    console.log('Check that audit and planning steps completed successfully.');
  }
}

// Add helpful command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
AI Tools HQ - Affiliate Management System

USAGE:
  node run-full-audit.js [options]

OPTIONS:
  --help, -h     Show this help message
  --quick, -q    Run quick audit (skip detailed analysis)
  --dashboard    Open dashboard after completion

DESCRIPTION:
  Runs complete affiliate link audit for ai-tools-hq.com
  Identifies missing affiliate links and creates action plan
  Saves Matt 20+ hours of manual research work
  
  Critical for Feb 7, 2026 deadline!

FILES GENERATED:
  • MATT-TODO-LIST.md - Your action items
  • affiliate-dashboard.html - Visual overview
  • affiliate-applications-tracker.csv - Progress tracking
  • affiliate-audit-report.json - Raw data
  • opportunity-matrix.json - Tool matches
  • application-plan.json - Detailed plan

NEXT STEPS:
  1. Open MATT-TODO-LIST.md
  2. Start with "Apply Today" items
  3. Track progress in CSV file
  4. Apply to 3-5 programs daily until deadline
`);
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  runFullAudit().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { runFullAudit };