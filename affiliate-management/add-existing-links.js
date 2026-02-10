#!/usr/bin/env node

/**
 * ADD EXISTING AFFILIATE LINKS
 * 
 * Quick script to add the affiliate links we already have from TOOLS.md
 * 
 * Usage: node add-existing-links.js
 * 
 * Built: 2026-02-10 by Damian
 */

const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const EXISTING_LINKS = [
  {
    tool: "Lovo.ai",
    url: "try.elevenlabs.io/f4il4v3cm496", 
    commission: "22%",
    program: "ElevenLabs Direct"
  },
  {
    tool: "Synthesia",
    url: "synthesia.io?via=matt-morales",
    commission: "25%", 
    program: "Synthesia Direct"
  }
];

async function addLink(tool, url) {
  try {
    console.log(`\n🔗 Adding ${tool}...`);
    const command = `node quick-add-links.js "${tool}" "${url}"`;
    const result = await execAsync(command);
    console.log(result.stdout);
    if (result.stderr) {
      console.error('Warning:', result.stderr);
    }
    return true;
  } catch (error) {
    console.error(`❌ Failed to add ${tool}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 ADDING EXISTING AFFILIATE LINKS');
  console.log('==================================\n');
  
  let added = 0;
  
  for (const link of EXISTING_LINKS) {
    const success = await addLink(link.tool, link.url);
    if (success) {
      added++;
      console.log(`✅ Added: ${link.tool} (${link.commission} via ${link.program})`);
    }
  }
  
  console.log(`\n📊 Results: ${added}/${EXISTING_LINKS.length} links added`);
  
  if (added > 0) {
    console.log('\n💰 Immediate revenue potential activated!');
    console.log('🎯 Next: Apply to Impact.com for Grammarly ($20/signup)');
  }
}

if (require.main === module) {
  main().catch(console.error);
}