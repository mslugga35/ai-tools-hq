/**
 * Add tools to Airtable (without complex fields)
 */
import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

const tools = [
  {
    Name: 'Jasper AI',
    Slug: 'jasper-ai',
    Category: 'Writing',
    Website: 'https://jasper.ai',
    Pricing: 'Free trial, $49/mo',
    Published: true
  },
  {
    Name: 'Copy.ai',
    Slug: 'copy-ai',
    Category: 'Writing',
    Website: 'https://copy.ai',
    Pricing: 'Free plan, Pro $49/mo',
    Published: true
  },
  {
    Name: 'Midjourney',
    Slug: 'midjourney',
    Category: 'Image',
    Website: 'https://midjourney.com',
    Pricing: 'From $10/mo',
    Published: true
  },
  {
    Name: 'DALL-E 3',
    Slug: 'dall-e-3',
    Category: 'Image',
    Website: 'https://openai.com/dall-e-3',
    Pricing: 'Included with ChatGPT Plus $20/mo',
    Published: true
  },
  {
    Name: 'GitHub Copilot',
    Slug: 'github-copilot',
    Category: 'Coding',
    Website: 'https://github.com/features/copilot',
    Pricing: 'Free for students, $10/mo',
    Published: true
  },
  {
    Name: 'Cursor',
    Slug: 'cursor',
    Category: 'Coding',
    Website: 'https://cursor.com',
    Pricing: 'Free tier, Pro $20/mo',
    Published: true
  },
  {
    Name: 'ElevenLabs',
    Slug: 'elevenlabs',
    Category: 'Audio',
    Website: 'https://elevenlabs.io',
    Pricing: 'Free tier, from $5/mo',
    Published: true
  },
  {
    Name: 'Notion AI',
    Slug: 'notion-ai',
    Category: 'Productivity',
    Website: 'https://notion.so/product/ai',
    Pricing: '$10/mo add-on',
    Published: true
  },
  {
    Name: 'Synthesia',
    Slug: 'synthesia',
    Category: 'Video',
    Website: 'https://synthesia.io',
    Pricing: 'From $30/mo',
    Published: true
  },
  {
    Name: 'ChatGPT',
    Slug: 'chatgpt',
    Category: 'Productivity',
    Website: 'https://chat.openai.com',
    Pricing: 'Free, Plus $20/mo',
    Published: true
  }
];

async function addTools() {
  console.log('🚀 Adding tools to Airtable...\n');

  for (const tool of tools) {
    try {
      await base('Tools').create(tool);
      console.log(`✅ Added: ${tool.Name}`);
    } catch (error) {
      console.error(`❌ Failed: ${tool.Name} - ${error.message}`);
    }
  }

  console.log('\n✨ Done! Site will rebuild in ~2 min.');
}

addTools();
