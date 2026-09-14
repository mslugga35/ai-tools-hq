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

  // Auto-discover blog posts. Includes Harbor articles: sync-harbor-blogs.mjs turns
  // public/blog/*.html into .md before the build. A post whose frontmatter names a
  // canonical elsewhere is a duplicate and stays out.
  const blogModules = import.meta.glob<{ frontmatter?: { canonical?: string } }>('./blog/*.md', { eager: true });
  const blogSlugs = Object.entries(blogModules)
    .filter(([, mod]) => !mod.frontmatter?.canonical)
    .map(([path]) => {
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

  // Cloudflare Pages serves this static build at directory URLs and 308-redirects
  // /tools/x to /tools/x/, and every page's own canonical carries the slash. Until
  // 2026-09-14 this sitemap listed the slashless form, so every URL in it redirected.
  // encodeURI: the "Developer Tools" category builds to /category/developer%20tools/,
  // and a raw space is not a valid <loc>.
  const loc = (page: string) => `${SITE}${encodeURI(page)}/`;

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
    <loc>${loc(page)}</loc>
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
