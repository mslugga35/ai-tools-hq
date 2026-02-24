#!/usr/bin/env node

/**
 * AFFILIATE APPLICATION TEMPLATE GENERATOR
 * =========================================
 * 
 * Generates personalized application emails/messages for each affiliate program.
 * Matt can copy-paste these when applying.
 * 
 * Usage: node apply-templates.js [--top N]
 * 
 * Built: 2026-02-09 (Nightly Build)
 */

const fs = require('fs').promises;
const path = require('path');

async function generateTemplates(topN = 15) {
  const raw = await fs.readFile(path.join(__dirname, 'action-plan.json'), 'utf-8');
  const plan = JSON.parse(raw);
  
  const actions = plan.prioritizedActions.slice(0, topN);
  
  const templates = [];
  
  for (const action of actions) {
    const prog = action.program;
    
    // Generic but professional template
    const template = {
      toolName: action.toolName,
      applyUrl: prog.applyUrl,
      commission: prog.commission,
      network: prog.network,
      
      // For applications that ask "Tell us about your website"
      websiteDescription: `AI Tools HQ (ai-tools-hq.com) is an independent AI tools review and comparison platform. We publish in-depth reviews, category roundups, and comparison guides for 129+ AI tools across 11 categories including Writing, Image, Video, Audio, Coding, Marketing, and more. Our content includes detailed reviews (2000+ words), SEO-optimized blog posts, and tool comparison pages that help users make informed purchasing decisions.`,
      
      // For "How will you promote?"
      promotionStrategy: `We promote through:
1. Dedicated tool review pages with in-depth analysis, pros/cons, and user ratings
2. Category "Best of" roundup posts (e.g., "Best AI Writing Tools 2026")
3. Tool comparison pages (e.g., "ChatGPT vs Claude")
4. SEO-optimized blog content targeting buyer-intent keywords
5. Our tools are indexed by Google and we target long-tail keywords like "best AI [category] tools" and "[tool name] review"`,
      
      // For "Expected monthly traffic"
      trafficEstimate: `We're a growing platform with organic SEO traffic. Our content targets high-intent keywords in the AI tools space, which is experiencing rapid growth. We currently have 129 tools listed with detailed reviews and 5+ blog posts targeting comparison and review keywords.`,
      
      // For "Why should we approve you?"
      whyApprove: `AI Tools HQ provides genuine value to your potential customers by offering:
- Honest, detailed reviews (not just rewritten marketing copy)
- Direct comparison with competitors so users can make informed decisions
- Category-specific roundups that highlight your tool's strengths
- SEO content targeting users actively looking for solutions like yours

Our audience is already researching AI tools — they're high-intent buyers ready to convert.`,
      
      // Quick copy-paste message
      quickMessage: `Hi! I run AI Tools HQ (ai-tools-hq.com), an AI tools review and comparison platform with 129+ tools across 11 categories. I'd love to join your affiliate program to feature ${action.toolName} with an in-depth review and include it in our relevant category roundups. Our content targets buyer-intent keywords and helps users make informed purchasing decisions. Thanks!`
    };
    
    templates.push(template);
  }
  
  // Generate markdown file
  let md = `# Affiliate Application Templates\n\n`;
  md += `*Generated: ${new Date().toLocaleDateString()}*\n`;
  md += `*Copy-paste these when applying to affiliate programs.*\n\n`;
  md += `---\n\n`;
  
  for (const t of templates) {
    md += `## ${t.toolName}\n`;
    md += `- **Apply:** ${t.applyUrl}\n`;
    md += `- **Commission:** ${t.commission}\n`;
    md += `- **Network:** ${t.network}\n\n`;
    
    md += `### Quick Copy-Paste Message\n`;
    md += `> ${t.quickMessage}\n\n`;
    
    md += `### Website Description (if asked)\n`;
    md += `> ${t.websiteDescription}\n\n`;
    
    md += `### Promotion Strategy (if asked)\n`;
    md += `> ${t.promotionStrategy}\n\n`;
    
    md += `---\n\n`;
  }
  
  md += `## Universal Answers\n\n`;
  md += `### "Tell us about your website"\n`;
  md += `> ${templates[0].websiteDescription}\n\n`;
  md += `### "How will you promote?"\n`;
  md += `> ${templates[0].promotionStrategy}\n\n`;
  md += `### "Expected traffic?"\n`;
  md += `> ${templates[0].trafficEstimate}\n\n`;
  md += `### "Why should we approve you?"\n`;
  md += `> ${templates[0].whyApprove}\n\n`;
  
  const mdPath = path.join(__dirname, 'application-templates.md');
  await fs.writeFile(mdPath, md);
  console.log(`📝 Templates saved: ${mdPath}`);
  console.log(`   ${templates.length} application templates ready for copy-paste`);
  
  return templates;
}

const topN = parseInt(process.argv.find(a => a.startsWith('--top'))?.split('=')[1] || '15');
generateTemplates(topN).catch(console.error);
