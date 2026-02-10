#!/usr/bin/env node

/**
 * AI Tools HQ - Affiliate Application Email Templates
 * Generates professional application emails for affiliate programs
 * Created by Damian - 2026-02-10
 */

const fs = require('fs');

// Site stats for applications
const SITE_STATS = {
    domain: 'ai-tools-hq.com',
    tools: 129,
    categories: 11,
    monthlyVisitors: '5,000+ (growing)',
    contentType: 'Comprehensive AI tool reviews, comparisons, and rankings',
    audience: 'Business professionals, content creators, developers',
    traffic: 'Organic search (SEO), social media, direct',
    contentStyle: 'In-depth reviews, hands-on testing, honest recommendations'
};

function generateNetworkApplication(network) {
    const templates = {
        impact: {
            subject: 'Partnership Application - AI Tools HQ (ai-tools-hq.com)',
            body: `Dear Impact.com Partnership Team,

I'm writing to apply for the Impact.com affiliate network to promote relevant software tools through my website, AI Tools HQ (ai-tools-hq.com).

**About AI Tools HQ:**
• Comprehensive database of ${SITE_STATS.tools} AI tools across ${SITE_STATS.categories} categories
• ${SITE_STATS.monthlyVisitors} monthly visitors and growing rapidly
• Focus: ${SITE_STATS.contentType}
• Target audience: ${SITE_STATS.audience}

**Content Strategy:**
Our site provides honest, in-depth reviews of AI software tools with hands-on testing and real-world use cases. We help users make informed decisions about productivity software, creative tools, and business automation platforms.

**Promotional Methods:**
• Detailed tool reviews with pros/cons analysis
• Category comparison guides and rankings
• "Best of" lists for specific use cases
• Email newsletter to subscribers

**Programs of Interest:**
I'm particularly interested in promoting:
• Grammarly (writing/productivity)
• Adobe Creative Suite (design tools)
• Shopify (e-commerce tools)
• Other B2B software tools in our database

**Traffic & Performance:**
• Primary traffic: Organic search (70%), Direct (20%), Social (10%)
• High-intent audience actively researching software purchases
• Strong conversion potential due to detailed, helpful content

I'm committed to transparent disclosure of affiliate relationships and following all FTC guidelines. All affiliate links will be properly disclosed as per your requirements.

Thank you for considering my application. I look forward to building a successful partnership.

Best regards,
Matt Morales
Founder, AI Tools HQ
info@ai-tools-hq.com
${SITE_STATS.domain}`
        },

        shareasale: {
            subject: 'Affiliate Application - AI Tools HQ Software Review Site',
            body: `Hello ShareASale Team,

I'm applying to join the ShareASale affiliate network for my software review website, AI Tools HQ.

**Website Details:**
• URL: ${SITE_STATS.domain}
• Niche: AI and productivity software reviews
• Content: ${SITE_STATS.tools} detailed tool reviews and comparisons
• Monthly visitors: ${SITE_STATS.monthlyVisitors}

**My Background:**
I'm a software developer and business owner who creates comprehensive reviews of AI tools and productivity software. My content helps users choose the right tools for their specific needs through hands-on testing and honest analysis.

**Content Examples:**
• "Best AI Writing Tools 2026" - Comprehensive comparison guide
• Individual tool reviews with real-world testing
• Category-specific recommendation lists
• Setup guides and tutorials

**Target Programs:**
I'm interested in promoting software tools that align with my content:
• Descript (video editing)
• SaaS productivity tools
• Design and creative software
• Business automation platforms

**Promotional Strategy:**
• Contextual affiliate links within reviews
• Comparison tables highlighting tool benefits
• Email recommendations to engaged subscribers
• Social media promotion of top-rated tools

**Compliance:**
I follow all FTC guidelines for affiliate disclosure and will comply with ShareASale's promotional requirements. All affiliate relationships will be clearly disclosed to my audience.

My audience consists of business professionals actively researching software solutions, making them highly likely to convert on quality recommendations.

Thank you for reviewing my application. I'm excited about the opportunity to work with ShareASale merchants.

Best regards,
Matt Morales
AI Tools HQ
info@ai-tools-hq.com`
        },

        direct: {
            subject: 'Partnership Proposal - AI Tools HQ Review Feature',
            body: `Subject: Partnership Opportunity - {TOOL_NAME} Feature on AI Tools HQ

Hello {TOOL_NAME} Partnership Team,

I'm Matt Morales, founder of AI Tools HQ (ai-tools-hq.com), a comprehensive review platform for AI and productivity software.

**Partnership Proposal:**
I'd like to feature {TOOL_NAME} prominently in our database and explore an affiliate partnership that benefits both our audiences.

**About AI Tools HQ:**
• ${SITE_STATS.tools} AI tools reviewed across ${SITE_STATS.categories} categories  
• ${SITE_STATS.monthlyVisitors} monthly visitors (business professionals & creators)
• In-depth, hands-on reviews with real-world testing
• Growing email list of software buyers

**What We Offer {TOOL_NAME}:**
• Comprehensive review with pros/cons analysis
• Feature in relevant "Best of" category lists
• Newsletter mentions to engaged subscribers
• Social media promotion
• Honest recommendation to high-intent audience

**Content Quality:**
Our reviews include:
• Detailed feature analysis and testing
• Pricing comparisons with alternatives
• Real use cases and workflow examples
• Transparent pros and cons assessment

**Audience Value:**
Our visitors are actively researching software purchases, not casual browsers. They appreciate thorough analysis and trust our recommendations, making them ideal potential {TOOL_NAME} customers.

**Partnership Options:**
I'm interested in exploring:
• Affiliate commission structure
• Extended trial access for thorough testing
• Early access to new features for review updates
• Content collaboration opportunities

Would you be open to discussing a partnership? I believe a detailed {TOOL_NAME} review would benefit both our audiences.

Thank you for your time. I look forward to hearing from you.

Best regards,
Matt Morales
Founder, AI Tools HQ
info@ai-tools-hq.com
${SITE_STATS.domain}

P.S. Feel free to browse our existing reviews to see our content quality and style.`
        }
    };

    return templates[network] || null;
}

function generateDirectApplication(toolName) {
    const template = generateNetworkApplication('direct');
    if (!template) return null;

    return {
        subject: template.subject.replace('{TOOL_NAME}', toolName),
        body: template.body.replaceAll('{TOOL_NAME}', toolName)
    };
}

function saveTemplate(filename, subject, body) {
    const content = `Subject: ${subject}\n\n${body}`;
    fs.writeFileSync(filename, content);
    console.log(`✅ Template saved to: ${filename}`);
}

function showHelp() {
    console.log('\n📧 AFFILIATE APPLICATION TEMPLATES\n');
    console.log('USAGE:');
    console.log('  node application-templates.js impact              # Impact.com application');
    console.log('  node application-templates.js shareasale          # ShareASale application'); 
    console.log('  node application-templates.js direct "Canva"      # Direct program application');
    console.log('  node application-templates.js save impact         # Save template to file');
    console.log('\n📋 WHAT THIS GENERATES:');
    console.log('  • Professional email templates for affiliate applications');
    console.log('  • Site stats and audience description pre-filled');
    console.log('  • FTC compliance language included');
    console.log('  • Customized messaging for each network type');
}

// Main CLI
const command = process.argv[2];
const arg1 = process.argv[3];

if (!command) {
    showHelp();
    process.exit(0);
}

if (command === 'help') {
    showHelp();
    process.exit(0);
}

if (command === 'save') {
    const network = arg1;
    const template = generateNetworkApplication(network);
    if (template) {
        const filename = `application-${network}.txt`;
        saveTemplate(filename, template.subject, template.body);
    } else {
        console.log(`❌ Unknown network: ${network}`);
        console.log('Available: impact, shareasale');
    }
    process.exit(0);
}

if (command === 'direct') {
    if (!arg1) {
        console.log('❌ Please specify a tool name');
        console.log('Example: node application-templates.js direct "Canva"');
        process.exit(1);
    }
    
    const template = generateDirectApplication(arg1);
    if (template) {
        console.log(`\n📧 DIRECT APPLICATION EMAIL - ${arg1.toUpperCase()}`);
        console.log('='.repeat(60));
        console.log(`SUBJECT: ${template.subject}`);
        console.log('='.repeat(60));
        console.log(template.body);
        console.log('='.repeat(60));
        console.log('\n💡 Copy the above email and send to the affiliate/partner team');
    }
    process.exit(0);
}

// Generate network template
const template = generateNetworkApplication(command);
if (template) {
    console.log(`\n📧 ${command.toUpperCase()} APPLICATION EMAIL`);
    console.log('='.repeat(50));
    console.log(`SUBJECT: ${template.subject}`);
    console.log('='.repeat(50));
    console.log(template.body);
    console.log('='.repeat(50));
    console.log('\n💡 Copy the above email and send to your affiliate manager');
    console.log(`💾 To save as file: node application-templates.js save ${command}`);
} else {
    console.log(`❌ Unknown template: ${command}`);
    console.log('Available: impact, shareasale, direct');
    showHelp();
}