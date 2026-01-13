/**
 * Seed Airtable with sample AI tools
 * Run: node scripts/seed-tools.js
 *
 * Requires AIRTABLE_API_KEY and AIRTABLE_BASE_ID in .env
 */

import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

const sampleTools = [
  {
    Name: 'Jasper AI',
    Slug: 'jasper-ai',
    Category: 'Writing',
    Description: 'AI writing assistant that helps create marketing copy, blog posts, and social media content 10x faster.',
    Website: 'https://jasper.ai',
    'Affiliate Link': 'https://jasper.ai',
    Pricing: 'Free trial, from $49/mo',
    Features: '• Blog post generator\n• Ad copy templates\n• SEO optimization\n• 50+ templates\n• Brand voice settings',
    Pros: '• Very fast output\n• Great for marketing copy\n• Many templates\n• Team collaboration',
    Cons: '• Can be expensive\n• Output needs editing\n• Learning curve',
    Review: 'Jasper AI is one of the most popular AI writing tools on the market. It excels at creating marketing copy, blog posts, and social media content quickly.\n\nThe template library is extensive, making it easy to get started. The brand voice feature helps maintain consistency across content.',
    Published: true
  },
  {
    Name: 'Copy.ai',
    Slug: 'copy-ai',
    Category: 'Writing',
    Description: 'AI-powered copywriting tool for creating marketing content, emails, and social posts in seconds.',
    Website: 'https://copy.ai',
    'Affiliate Link': 'https://copy.ai',
    Pricing: 'Free plan, Pro $49/mo',
    Features: '• 90+ copywriting tools\n• Chat interface\n• Brand voice\n• Workflow automation\n• API access',
    Pros: '• Generous free plan\n• Easy to use\n• Good for short-form\n• Fast generation',
    Cons: '• Long-form less polished\n• Limited customization\n• Repetitive outputs',
    Review: 'Copy.ai is perfect for marketers who need quick copy for ads, emails, and social media. The free plan is generous and the interface is intuitive.\n\nBest for short-form content rather than long blog posts.',
    Published: true
  },
  {
    Name: 'Midjourney',
    Slug: 'midjourney',
    Category: 'Image',
    Description: 'Industry-leading AI image generator known for stunning artistic visuals and photorealistic outputs.',
    Website: 'https://midjourney.com',
    'Affiliate Link': 'https://midjourney.com',
    Pricing: 'From $10/mo',
    Features: '• Text-to-image generation\n• Style variations\n• Upscaling\n• Pan and zoom\n• Remix mode',
    Pros: '• Best image quality\n• Artistic styles\n• Active community\n• Constant updates',
    Cons: '• Discord-only interface\n• No free tier\n• Learning curve for prompts',
    Review: 'Midjourney produces the most visually stunning AI images available. The artistic quality is unmatched, making it the go-to choice for designers and artists.\n\nThe Discord-based interface takes getting used to, but the results are worth it.',
    Published: true
  },
  {
    Name: 'DALL-E 3',
    Slug: 'dall-e-3',
    Category: 'Image',
    Description: 'OpenAI\'s latest image generator with exceptional prompt understanding and text rendering.',
    Website: 'https://openai.com/dall-e-3',
    'Affiliate Link': 'https://openai.com/dall-e-3',
    Pricing: 'Included with ChatGPT Plus $20/mo',
    Features: '• Advanced prompt understanding\n• Text in images\n• ChatGPT integration\n• API access\n• Multiple styles',
    Pros: '• Best text rendering\n• Understands complex prompts\n• Easy via ChatGPT\n• Safe outputs',
    Cons: '• Limited generations\n• Less artistic than MJ\n• Content restrictions',
    Review: 'DALL-E 3 excels at understanding exactly what you want. It handles complex prompts better than competitors and actually renders text correctly in images.\n\nIntegration with ChatGPT makes it incredibly easy to use.',
    Published: true
  },
  {
    Name: 'GitHub Copilot',
    Slug: 'github-copilot',
    Category: 'Coding',
    Description: 'AI pair programmer that suggests code completions in real-time as you type.',
    Website: 'https://github.com/features/copilot',
    'Affiliate Link': 'https://github.com/features/copilot',
    Pricing: 'Free for students, $10/mo',
    Features: '• Code completion\n• Full function suggestions\n• Multi-language support\n• IDE integration\n• Chat interface',
    Pros: '• Speeds up coding significantly\n• Learns your style\n• Great IDE support\n• Explains code',
    Cons: '• Subscription required\n• Sometimes wrong suggestions\n• Privacy concerns',
    Review: 'GitHub Copilot is a game-changer for developers. It suggests entire functions, helps with boilerplate, and can explain complex code.\n\nThe time savings are substantial once you learn to work with it effectively.',
    Published: true
  },
  {
    Name: 'Cursor',
    Slug: 'cursor',
    Category: 'Coding',
    Description: 'AI-first code editor built for pair programming with AI. The VS Code alternative for AI coding.',
    Website: 'https://cursor.com',
    'Affiliate Link': 'https://cursor.com',
    Pricing: 'Free tier, Pro $20/mo',
    Features: '• AI chat in editor\n• Codebase understanding\n• Multi-file edits\n• VS Code compatible\n• Custom AI models',
    Pros: '• Understands full codebase\n• Natural chat interface\n• Fast iterations\n• Great UX',
    Cons: '• New product, some bugs\n• Resource intensive\n• Learning curve',
    Review: 'Cursor reimagines what an AI code editor can be. Unlike Copilot, it understands your entire codebase and can make changes across multiple files.\n\nThe chat interface feels natural and the results are impressive.',
    Published: true
  },
  {
    Name: 'ElevenLabs',
    Slug: 'elevenlabs',
    Category: 'Audio',
    Description: 'The most realistic AI voice generator for creating natural-sounding voiceovers and speech.',
    Website: 'https://elevenlabs.io',
    'Affiliate Link': 'https://elevenlabs.io',
    Pricing: 'Free tier, from $5/mo',
    Features: '• Text-to-speech\n• Voice cloning\n• 29 languages\n• API access\n• Voice library',
    Pros: '• Most realistic voices\n• Great voice cloning\n• Many languages\n• Easy API',
    Cons: '• Limited free tier\n• Can be expensive at scale\n• Ethical concerns',
    Review: 'ElevenLabs produces the most natural-sounding AI voices available. The voice cloning feature is remarkably accurate with just a few minutes of sample audio.\n\nPerfect for podcasts, videos, and audiobooks.',
    Published: true
  },
  {
    Name: 'Notion AI',
    Slug: 'notion-ai',
    Category: 'Productivity',
    Description: 'AI assistant built into Notion for writing, summarizing, and brainstorming within your workspace.',
    Website: 'https://notion.so/product/ai',
    'Affiliate Link': 'https://notion.so/product/ai',
    Pricing: '$10/mo add-on',
    Features: '• Writing assistance\n• Summarization\n• Translation\n• Action items extraction\n• Q&A on docs',
    Pros: '• Seamless integration\n• Context-aware\n• Good for docs\n• Easy to use',
    Cons: '• Requires Notion\n• Additional cost\n• Limited vs standalone',
    Review: 'Notion AI brings AI capabilities directly into your workspace. It\'s incredibly convenient for summarizing meeting notes, drafting content, and extracting action items.\n\nBest for teams already using Notion.',
    Published: true
  },
  {
    Name: 'Synthesia',
    Slug: 'synthesia',
    Category: 'Video',
    Description: 'Create professional AI videos with realistic avatars. No cameras, actors, or studios needed.',
    Website: 'https://synthesia.io',
    'Affiliate Link': 'https://synthesia.io',
    Pricing: 'From $30/mo',
    Features: '• 150+ AI avatars\n• 120+ languages\n• Custom avatars\n• Screen recording\n• Templates',
    Pros: '• Professional quality\n• No filming needed\n• Fast turnaround\n• Many avatars',
    Cons: '• Expensive\n• Avatars can feel uncanny\n• Limited customization',
    Review: 'Synthesia makes video production accessible to everyone. Create training videos, marketing content, and presentations without cameras or actors.\n\nThe avatar quality is impressive, though they\'re not perfect.',
    Published: true
  },
  {
    Name: 'HubSpot AI',
    Slug: 'hubspot-ai',
    Category: 'Marketing',
    Description: 'AI-powered marketing tools for email writing, content creation, and campaign optimization.',
    Website: 'https://hubspot.com/artificial-intelligence',
    'Affiliate Link': 'https://hubspot.com/artificial-intelligence',
    Pricing: 'Included with HubSpot plans',
    Features: '• Email generation\n• Blog writing\n• Social posts\n• SEO recommendations\n• Chatbot builder',
    Pros: '• Integrated with CRM\n• Data-driven suggestions\n• Easy to use\n• No extra cost',
    Cons: '• Requires HubSpot\n• Less powerful standalone\n• Limited customization',
    Review: 'HubSpot AI brings generative AI directly into your marketing workflow. Write emails, create blog posts, and optimize campaigns without leaving the platform.\n\nBest value for existing HubSpot users.',
    Published: true
  }
];

async function seedTools() {
  console.log('🌱 Seeding Airtable with sample tools...\n');

  for (const tool of sampleTools) {
    try {
      const created = await base('Tools').create(tool);
      console.log(`✅ Created: ${tool.Name}`);
    } catch (error) {
      console.error(`❌ Failed to create ${tool.Name}:`, error.message);
    }
  }

  console.log('\n✨ Done! Refresh your site in 2-3 minutes after Vercel rebuilds.');
}

seedTools();
