#!/usr/bin/env node

/**
 * AI Tools HQ - Affiliate Application Tracker
 * Guides Matt through systematic affiliate program applications
 * Created by Damian - 2026-02-10
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TRACKER_FILE = 'affiliate-applications.json';
const TOOLS_FILE = '../src/data/tools.json';

// Load existing data
function loadTracker() {
    try {
        return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'));
    } catch (error) {
        return {
            lastUpdated: new Date().toISOString(),
            applications: {},
            completed: [],
            rejected: [],
            approved: [],
            revenue: {}
        };
    }
}

function saveTracker(data) {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(TRACKER_FILE, JSON.stringify(data, null, 2));
}

function loadTools() {
    try {
        return JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
    } catch (error) {
        console.error('❌ Could not load tools.json');
        return [];
    }
}

// Priority affiliate programs with application details
const AFFILIATE_PROGRAMS = {
    'impact.com': {
        name: 'Impact.com',
        difficulty: 'Easy',
        tools: ['Grammarly', 'Shopify', 'Adobe Photoshop'],
        commissions: '15-30%',
        signupUrl: 'https://impact.com/advertisers/',
        credentials: 'mslugga35 (existing login)',
        priority: 1,
        notes: 'Already have account, just need to apply to specific programs'
    },
    'shareasale': {
        name: 'ShareASale',
        difficulty: 'Easy',
        tools: ['Descript', 'WP Engine', 'SaaS tools'],
        commissions: '20-50%',
        signupUrl: 'https://account.shareasale.com/newsignup.cfm',
        credentials: 'Need to create account',
        priority: 2,
        notes: 'Good for B2B software tools'
    },
    'cj.com': {
        name: 'Commission Junction',
        difficulty: 'Medium',
        tools: ['Adobe', 'Microsoft', 'Enterprise tools'],
        commissions: '3-25%',
        signupUrl: 'https://www.cj.com/affiliate-marketing',
        credentials: 'Need to create account',
        priority: 3,
        notes: 'Big brands, lower commissions but high volume'
    },
    'partnerstack': {
        name: 'PartnerStack',
        difficulty: 'Medium',
        tools: ['B2B SaaS tools', 'Startup tools'],
        commissions: '20-30%',
        signupUrl: 'https://partnerstack.com/partner-program',
        credentials: 'Need to create account',
        priority: 4,
        notes: 'Many modern SaaS tools use this platform'
    }
};

// Direct affiliate programs for top tools
const DIRECT_PROGRAMS = {
    'elevenlabs': {
        tool: 'ElevenLabs',
        commission: '22%',
        url: 'try.elevenlabs.io/f4il4v3cm496',
        status: 'approved',
        notes: 'Already have link - need to add to database'
    },
    'canva': {
        tool: 'Canva',
        commission: '30-50%',
        signupUrl: 'https://partner.canva.com/affiliate-program',
        status: 'need-to-apply',
        priority: 'high'
    },
    'jasper': {
        tool: 'Jasper',
        commission: '30%',
        signupUrl: 'https://www.jasper.ai/partners',
        status: 'need-to-apply',
        priority: 'high'
    },
    'copy.ai': {
        tool: 'Copy.ai',
        commission: '50%',
        signupUrl: 'https://www.copy.ai/affiliate-program',
        status: 'need-to-apply',
        priority: 'high'
    },
    'pictory': {
        tool: 'Pictory',
        commission: '30%',
        signupUrl: 'https://pictory.ai/affiliate-program',
        status: 'need-to-apply',
        priority: 'medium'
    },
    'synthesia': {
        tool: 'Synthesia',
        commission: '25%',
        url: 'synthesia.io?via=matt-morales',
        status: 'approved',
        notes: 'Already have link from MEMORY.md'
    }
};

function showDashboard() {
    const tracker = loadTracker();
    const tools = loadTools();
    
    console.log('\n🎯 AI TOOLS HQ - AFFILIATE APPLICATION TRACKER\n');
    console.log(`📊 Status: ${tools.length} tools total, ${tracker.approved.length} approved affiliates\n`);
    
    // Priority Networks
    console.log('🏆 PRIORITY NETWORKS TO APPLY:');
    Object.entries(AFFILIATE_PROGRAMS)
        .sort((a, b) => a[1].priority - b[1].priority)
        .forEach(([key, program]) => {
            const status = tracker.applications[key]?.status || '⏳ not-started';
            const statusIcon = {
                'approved': '✅',
                'pending': '🔄', 
                'rejected': '❌',
                'not-started': '⏳'
            }[status] || '❓';
            
            console.log(`${statusIcon} ${program.name}`);
            console.log(`   Tools: ${program.tools.slice(0, 3).join(', ')}`);
            console.log(`   Commission: ${program.commissions} | ${program.difficulty}`);
            if (status === 'not-started') {
                console.log(`   🔗 Apply: ${program.signupUrl}`);
            }
            console.log('');
        });
    
    // Direct Programs
    console.log('💎 DIRECT PROGRAMS (High Priority):');
    Object.entries(DIRECT_PROGRAMS)
        .filter(([key, program]) => program.priority === 'high' || program.status === 'approved')
        .forEach(([key, program]) => {
            const statusIcon = program.status === 'approved' ? '✅' : '⏳';
            console.log(`${statusIcon} ${program.tool} (${program.commission})`);
            if (program.status === 'approved' && program.url) {
                console.log(`   Link: ${program.url}`);
            } else if (program.signupUrl) {
                console.log(`   Apply: ${program.signupUrl}`);
            }
        });
    
    console.log('\n📈 REVENUE ESTIMATE:');
    console.log('   Current: $0/month (0 active links)');
    console.log('   With Priority Programs: $500-1000/month');
    console.log('   Full Coverage (80 tools): $2000-4000/month');
    
    console.log('\n🎯 NEXT ACTIONS:');
    console.log('   1. Run: node affiliate-application-tracker.js apply impact');
    console.log('   2. Run: node affiliate-application-tracker.js apply elevenlabs');  
    console.log('   3. Run: node affiliate-application-tracker.js status');
}

function recordApplication(programKey, details = {}) {
    const tracker = loadTracker();
    const timestamp = new Date().toISOString();
    
    if (AFFILIATE_PROGRAMS[programKey]) {
        const program = AFFILIATE_PROGRAMS[programKey];
        tracker.applications[programKey] = {
            program: program.name,
            appliedAt: timestamp,
            status: 'pending',
            tools: program.tools,
            signupUrl: program.signupUrl,
            ...details
        };
        
        console.log(`✅ Recorded application to ${program.name}`);
        console.log(`📅 Applied: ${new Date(timestamp).toLocaleDateString()}`);
        console.log(`⏳ Status: Pending review`);
        console.log(`\n📋 Application Details:`);
        console.log(`   - Website: ai-tools-hq.com`);
        console.log(`   - Category: Software/Technology Reviews`);
        console.log(`   - Content: ${program.tools.length} tools in database`);
        console.log(`   - Target: ${program.tools.join(', ')}`);
        
        if (program.credentials) {
            console.log(`\n🔑 Account: ${program.credentials}`);
        }
        
    } else if (DIRECT_PROGRAMS[programKey]) {
        const program = DIRECT_PROGRAMS[programKey];
        tracker.applications[programKey] = {
            program: program.tool,
            appliedAt: timestamp,
            status: program.status === 'approved' ? 'approved' : 'pending',
            commission: program.commission,
            signupUrl: program.signupUrl || 'Direct contact',
            ...details
        };
        
        if (program.status === 'approved') {
            if (!tracker.approved.includes(programKey)) {
                tracker.approved.push(programKey);
            }
            console.log(`✅ ${program.tool} affiliate already approved!`);
            console.log(`🔗 Link: ${program.url}`);
            console.log(`💰 Commission: ${program.commission}`);
            console.log(`\n⚡ Next: Add to tools database with quick-add-links.js`);
        } else {
            console.log(`📝 Recorded application to ${program.tool} direct program`);
            console.log(`🔗 Apply at: ${program.signupUrl}`);
        }
    } else {
        console.log(`❌ Unknown program: ${programKey}`);
        return false;
    }
    
    saveTracker(tracker);
    return true;
}

function updateStatus(programKey, newStatus, notes = '') {
    const tracker = loadTracker();
    
    if (!tracker.applications[programKey]) {
        console.log(`❌ No application found for: ${programKey}`);
        return false;
    }
    
    const oldStatus = tracker.applications[programKey].status;
    tracker.applications[programKey].status = newStatus;
    tracker.applications[programKey].updatedAt = new Date().toISOString();
    
    if (notes) {
        tracker.applications[programKey].notes = notes;
    }
    
    // Move to appropriate arrays
    [tracker.approved, tracker.rejected, tracker.completed].forEach(arr => {
        const index = arr.indexOf(programKey);
        if (index > -1) arr.splice(index, 1);
    });
    
    if (newStatus === 'approved') {
        tracker.approved.push(programKey);
    } else if (newStatus === 'rejected') {
        tracker.rejected.push(programKey);
    }
    
    saveTracker(tracker);
    
    console.log(`✅ Updated ${programKey}: ${oldStatus} → ${newStatus}`);
    if (notes) console.log(`📝 Notes: ${notes}`);
    
    return true;
}

function showStatus() {
    const tracker = loadTracker();
    
    console.log('\n📊 AFFILIATE APPLICATION STATUS\n');
    
    Object.entries(tracker.applications).forEach(([key, app]) => {
        const statusIcon = {
            'approved': '✅',
            'pending': '🔄',
            'rejected': '❌',
            'completed': '✅'
        }[app.status] || '❓';
        
        console.log(`${statusIcon} ${app.program}`);
        console.log(`   Applied: ${new Date(app.appliedAt).toLocaleDateString()}`);
        console.log(`   Status: ${app.status.toUpperCase()}`);
        if (app.notes) {
            console.log(`   Notes: ${app.notes}`);
        }
        console.log('');
    });
    
    console.log(`📈 Summary: ${tracker.approved.length} approved, ${Object.keys(tracker.applications).length - tracker.approved.length} pending`);
}

function showHelp() {
    console.log('\n🎯 AI TOOLS HQ - AFFILIATE APPLICATION TRACKER');
    console.log('\nCOMMANDS:');
    console.log('  dashboard              Show priority programs and status');
    console.log('  apply <program>        Record application to a program');
    console.log('  status                 Show all application statuses');
    console.log('  update <program> <status> [notes]  Update application status');
    console.log('  help                   Show this help');
    
    console.log('\nPROGRAMS:');
    console.log('  Networks: impact, shareasale, cj, partnerstack');
    console.log('  Direct: elevenlabs, canva, jasper, copy.ai, pictory');
    
    console.log('\nSTATUSES:');
    console.log('  pending, approved, rejected');
    
    console.log('\nEXAMPLES:');
    console.log('  node affiliate-application-tracker.js apply impact');
    console.log('  node affiliate-application-tracker.js apply elevenlabs');
    console.log('  node affiliate-application-tracker.js update impact approved "Approved for Grammarly program"');
}

// Main CLI
const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];
const arg3 = process.argv.slice(5).join(' ');

switch (command) {
    case 'apply':
        if (!arg1) {
            console.log('❌ Please specify a program to apply to');
            console.log('Available: impact, shareasale, cj, partnerstack, elevenlabs, canva, jasper, copy.ai, pictory');
        } else {
            recordApplication(arg1);
        }
        break;
    
    case 'update':
        if (!arg1 || !arg2) {
            console.log('❌ Usage: update <program> <status> [notes]');
            console.log('Statuses: pending, approved, rejected');
        } else {
            updateStatus(arg1, arg2, arg3);
        }
        break;
    
    case 'status':
        showStatus();
        break;
    
    case 'help':
        showHelp();
        break;
    
    default:
        showDashboard();
}