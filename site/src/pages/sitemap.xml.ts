import type { APIRoute } from 'astro';
import { getAllTools, getCategories } from '../lib/supabase';
import { generateComparisonPairs, isIndexedComparison } from '../lib/seo-utils';

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
    '/deals',
    '/sponsors',
    '/advertise',
    '/picks-api',
  ];

  const bestPages = [
    '/best/ai-writing-tools',
    '/best/free-ai-tools',
    '/best/ai-image-generators',
    '/best/ai-coding-assistants',
    '/best/ai-video-tools',
    '/best/ai-voice-generators',
    '/best/ai-productivity-tools',
    '/best/ai-marketing-tools',
    '/best/ai-data-tools',
  ];

  const bestForPages = [
    '/best-for',
    '/best-for/content-creators',
    '/best-for/freelancers',
    '/best-for/marketers',
    '/best-for/developers',
    '/best-for/small-business-owners',
    '/best-for/students',
    '/best-for/podcasters',
    '/best-for/video-creators',
    '/best-for/social-media-managers',
    '/best-for/startups',
    '/best-for/ecommerce-sellers',
    '/best-for/remote-teams',
  ];

  const toolPages = tools.map(t => `/tools/${t.slug}`);
  const alternativePages = tools.map(t => `/alternatives/${t.slug}`);
  const categoryPages = categories.map(c => `/category/${c.toLowerCase()}`);

  // Only include indexed comparison pairs in sitemap (top 25-30 high-value matchups)
  const comparisonPairs = generateComparisonPairs(tools);
  const topComparisons = comparisonPairs
    .filter(([a, b]) => isIndexedComparison(a.slug, b.slug))
    .map(([a, b]) => `/compare/${a.slug}/${b.slug}`);

  // Auto-discover blog post filenames (lazy — only need keys, not content)
  const blogModules = import.meta.glob('./blog/*.md');
  const blogSlugs = Object.keys(blogModules).map(path => {
    const filename = path.split('/').pop()?.replace('.md', '') ?? '';
    return `/blog/${filename}`;
  });
  const blogPages = ['/blog', ...blogSlugs];

  const allPages = [
    ...staticPages,
    ...bestPages,
    ...bestForPages,
    ...blogPages,
    ...toolPages,
    ...alternativePages,
    ...categoryPages,
    ...topComparisons,
  ];

  const today = new Date().toISOString().split('T')[0];

  function getPriority(page: string): string {
    if (page === '') return '1.0';
    if (page === '/blog') return '0.8';
    if (page.startsWith('/tools/')) return '0.8';
    if (page.startsWith('/alternatives/')) return '0.7';
    if (page.startsWith('/best-for/')) return '0.7';
    if (page.startsWith('/blog/')) return '0.7';
    if (page.startsWith('/category/')) return '0.7';
    if (page.startsWith('/compare/')) return '0.6';
    return '0.5';
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${SITE}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${getPriority(page)}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
