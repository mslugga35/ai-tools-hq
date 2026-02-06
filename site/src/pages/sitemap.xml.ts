import type { APIRoute } from 'astro';
import { getAllTools, getCategories } from '../lib/supabase';
import { generateComparisonPairs } from '../lib/seo-utils';

const SITE = 'https://www.ai-tools-hq.com';

export const prerender = true;

export const GET: APIRoute = async () => {
  const tools = await getAllTools();
  const categories = await getCategories();

  const staticPages = [
    '',
    '/tools',
    '/compare',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];

  const bestPages = [
    '/best/ai-writing-tools',
    '/best/free-ai-tools',
    '/best/ai-image-generators',
    '/best/ai-coding-assistants',
    '/best/ai-video-tools',
    '/best/ai-voice-generators',
    '/best/ai-productivity-tools',
  ];

  const toolPages = tools.map(t => `/tools/${t.slug}`);
  const categoryPages = categories.map(c => `/category/${c.toLowerCase()}`);
  
  // Same-category comparison pairs (uses shared logic from seo-utils)
  const comparisonPairs = generateComparisonPairs(tools);
  const topComparisons = comparisonPairs.map(([a, b]) => `/compare/${a.slug}/${b.slug}`);

  const allPages = [
    ...staticPages,
    ...bestPages,
    ...toolPages,
    ...categoryPages,
    ...topComparisons,
  ];

  const today = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${SITE}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page.startsWith('/tools/') ? '0.8' : page.startsWith('/category/') ? '0.7' : page.startsWith('/compare/') ? '0.6' : '0.5'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
