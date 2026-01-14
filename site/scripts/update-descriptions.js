/**
 * Update tool descriptions in Airtable
 */
import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

const descriptions = {
  'Jasper AI': 'AI writing assistant that helps create marketing copy, blog posts, and social media content 10x faster. Perfect for marketers and content teams.',
  'Jasper': 'AI writing assistant that helps create marketing copy, blog posts, and social media content 10x faster. Perfect for marketers and content teams.',
  'Copy.ai': 'AI-powered copywriting tool for creating marketing content, emails, and social posts in seconds. Generous free plan available.',
  'Midjourney': 'Industry-leading AI image generator known for stunning artistic visuals and photorealistic outputs. Best-in-class quality.',
  'DALL-E 3': 'OpenAI\'s latest image generator with exceptional prompt understanding and accurate text rendering in images.',
  'GitHub Copilot': 'AI pair programmer that suggests code completions in real-time as you type. Supports all major languages and IDEs.',
  'Cursor': 'AI-first code editor built for pair programming with AI. Understands your entire codebase for smarter suggestions.',
  'ElevenLabs': 'The most realistic AI voice generator for creating natural-sounding voiceovers, podcasts, and audiobooks.',
  'Notion AI': 'AI assistant built into Notion for writing, summarizing, brainstorming, and extracting action items from your docs.',
  'Synthesia': 'Create professional AI videos with realistic avatars. No cameras, actors, or studios needed. 150+ avatars, 120+ languages.',
  'ChatGPT': 'OpenAI\'s conversational AI assistant for writing, coding, analysis, and creative tasks. The most popular AI tool worldwide.',
  'Surfer SEO': 'AI-powered SEO tool that helps optimize content for search rankings with real-time suggestions and competitor analysis.',
  'Anyword': 'AI copywriting platform with predictive performance scores. Know which copy will convert before you publish.',
  'Frase': 'AI-powered SEO content tool that helps research, write, and optimize articles that rank. Great for content marketers.',
  'QuillBot': 'AI paraphrasing and grammar tool that helps rewrite sentences and improve clarity. Free tier available.',
  'Peppertype': 'AI content assistant for generating marketing copy, blog ideas, and social media content quickly.',
  'Wordtune': 'AI writing companion that suggests better ways to phrase your sentences. Integrates with your browser.',
  'Sudowrite': 'AI writing tool designed for fiction authors. Helps with brainstorming, descriptions, and overcoming writer\'s block.',
  'Hemingway Editor': 'Writing app that highlights complex sentences and common errors. Makes your writing bold and clear.',
  'Ideogram': 'AI image generator that excels at typography and text in images. Great for logos and designs with text.',
  'Grammarly': 'AI-powered writing assistant for grammar, spelling, punctuation, and style. Works everywhere you write.',
  'Clearscope': 'Enterprise SEO content optimization platform. Helps create content that ranks with AI-driven recommendations.',
  'Rytr': 'Affordable AI writing assistant for creating content in 30+ languages. Great value for small teams.',
  'Writesonic': 'AI writer for blogs, ads, emails, and websites. Includes Chatsonic AI chatbot and image generation.',
  'Leonardo.AI': 'AI image generation platform with fine-tuned models for game assets, characters, and concept art.',
  'Stable Diffusion': 'Open-source AI image generator. Run locally or use hosted versions. Highly customizable.',
  'INK Editor': 'AI writing and SEO assistant that helps create optimized content that ranks and converts.'
};

async function updateDescriptions() {
  console.log('📝 Updating tool descriptions...\n');

  try {
    const records = await base('Tools').select().all();

    let updated = 0;
    let skipped = 0;

    for (const record of records) {
      const name = record.get('Name');
      if (!name) continue;

      const description = descriptions[name];

      if (description) {
        await base('Tools').update(record.id, { Description: description });
        console.log(`✅ ${name}`);
        updated++;
      } else {
        console.log(`⏭️  ${name} (no description)`);
        skipped++;
      }
    }

    console.log(`\n✨ Done! Updated: ${updated}, Skipped: ${skipped}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updateDescriptions();
