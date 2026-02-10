#!/usr/bin/env node

/**
 * QUICK AFFILIATE LINK ADDER
 * 
 * Fast way for Matt to add affiliate links to high-priority tools.
 * 
 * Usage:
 *   node quick-add-links.js "Grammarly" "https://grammarly.go2cloud.org/aff_c?offer_id=329&aff_id=72830"
 *   node quick-add-links.js list-missing
 *   node quick-add-links.js bulk-update ./affiliate-links.csv
 * 
 * Built: 2026-02-10 by Damian for Matt
 */

const fs = require('fs').promises;
const path = require('path');

// Supabase connection (same as ai-tools-hq)
const SUPABASE_URL = 'https://ebhtzgimevacvcgiyesc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaHR6Z2ltZXZhY3ZjZ2l5ZXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDIyMTksImV4cCI6MjA2ODM3ODIxOX0.msMqXGX33MIygHQWG4n2BdP8JVLOR9Yi5WkiDRwZEbY';

async function supabaseFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  
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
}

async function addAffiliateLink(toolName, affiliateUrl) {
  console.log(`🔍 Finding tool: ${toolName}...`);
  
  // Find tool by name (case insensitive)
  const tools = await supabaseFetch(`tools?select=id,name,website,affiliate_link&name=ilike.*${toolName}*`);
  
  if (tools.length === 0) {
    console.log(`❌ Tool not found: ${toolName}`);
    console.log('💡 Use: node quick-add-links.js list-missing | grep -i "toolname"');
    return false;
  }
  
  if (tools.length > 1) {
    console.log(`⚠️ Multiple matches found:`);
    tools.forEach(t => console.log(`   - ${t.name} (ID: ${t.id})`));
    console.log('💡 Use exact name to avoid ambiguity');
    return false;
  }
  
  const tool = tools[0];
  console.log(`✅ Found: ${tool.name} (${tool.website})`);
  
  if (tool.affiliate_link && tool.affiliate_link !== tool.website) {
    console.log(`⚠️ Tool already has affiliate link: ${tool.affiliate_link}`);
    console.log('Continue? (y/N)');
    // In a real CLI, you'd wait for input. For now, skip.
    console.log('Skipping (already has link)');
    return false;
  }
  
  // Update the affiliate link
  console.log(`🔧 Adding affiliate link...`);
  const result = await supabaseFetch(`tools?id=eq.${tool.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      affiliate_link: affiliateUrl
    }),
    headers: {
      'Prefer': 'return=representation'
    }
  });
  
  console.log(`✅ SUCCESS: ${tool.name} now has affiliate link!`);
  console.log(`🔗 Link: ${affiliateUrl}`);
  return true;
}

async function listMissing() {
  console.log('📋 TOOLS MISSING AFFILIATE LINKS');
  console.log('================================\n');
  
  const tools = await supabaseFetch('tools?select=name,category,website,affiliate_link&generated=eq.true&order=category,name');
  
  const missing = tools.filter(t => 
    !t.affiliate_link || t.affiliate_link.length === 0 || t.affiliate_link === t.website
  );
  
  let currentCategory = '';
  missing.forEach(tool => {
    if (tool.category !== currentCategory) {
      currentCategory = tool.category;
      console.log(`\n📁 ${currentCategory.toUpperCase()}`);
      console.log('='.repeat(currentCategory.length + 3));
    }
    console.log(`   ${tool.name}`);
  });
  
  console.log(`\n📊 Total missing: ${missing.length}/${tools.length} tools`);
  console.log(`💰 Potential: ~$4,330/month (based on audit)`);
}

async function generateTemplate() {
  console.log('📝 AFFILIATE LINK BULK TEMPLATE');
  console.log('===============================\n');
  
  const tools = await supabaseFetch('tools?select=name,category,website,affiliate_link&generated=eq.true&order=category,name');
  
  const missing = tools.filter(t => 
    !t.affiliate_link || t.affiliate_link.length === 0 || t.affiliate_link === t.website
  ).slice(0, 20); // Top 20
  
  console.log('Copy this template and fill in the affiliate links:\n');
  console.log('Tool Name,Affiliate URL,Commission,Program');
  missing.forEach(tool => {
    console.log(`"${tool.name}","[ADD_LINK_HERE]","[RATE]","[PROGRAM]"`);
  });
  
  console.log('\nSave as affiliate-links.csv and run:');
  console.log('node quick-add-links.js bulk-update affiliate-links.csv');
}

async function main() {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];
  
  try {
    switch (command) {
      case undefined:
      case 'help':
        console.log('AFFILIATE LINK QUICK ADDER');
        console.log('==========================');
        console.log('Usage:');
        console.log('  node quick-add-links.js "Tool Name" "affiliate-url"');
        console.log('  node quick-add-links.js list-missing');
        console.log('  node quick-add-links.js template');
        console.log('');
        console.log('Examples:');
        console.log('  node quick-add-links.js "Grammarly" "https://grammarly.go2cloud.org/..."');
        console.log('  node quick-add-links.js "Canva" "https://partner.canva.com/..."');
        break;
        
      case 'list-missing':
        await listMissing();
        break;
        
      case 'template':
        await generateTemplate();
        break;
        
      default:
        if (arg1 && arg2) {
          await addAffiliateLink(command, arg1);
        } else {
          console.log('❌ Invalid usage. Need: tool-name and affiliate-url');
          console.log('💡 Try: node quick-add-links.js help');
        }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}