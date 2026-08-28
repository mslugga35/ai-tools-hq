/**
 * Build a static, public search index for the WebMCP tools on ai-tools-hq.com.
 *
 * The site is Astro SSG - Supabase is only reached at BUILD time, so there is no
 * runtime endpoint an agent tool could call. Rather than shipping a Supabase key
 * to the browser, this bakes a slim index into public/tools-index.json.
 *
 * Uses the ANON key only (read-only, RLS-enforced). Never the service key.
 *
 * Re-run after publishing tools:
 *   node scripts/build-tools-index.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const envPath = fileURLToPath(new URL('../.env', import.meta.url));
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
    })
);

const URL_ = env.SUPABASE_URL;
const KEY = env.SUPABASE_ANON_KEY;
if (!URL_ || !KEY) throw new Error('SUPABASE_URL / SUPABASE_ANON_KEY missing from .env');

const endpoint =
  `${URL_}/rest/v1/tools?select=name,slug,category,description,pricing&generated=eq.true&published=eq.true&order=name.asc`;

const res = await fetch(endpoint, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
const rows = await res.json();

// RLS requires BOTH generated=true AND published=true (project CLAUDE.md).
// Filtering on generated alone leaks unpublished tools into a file every
// visitor can fetch - the index must never be laxer than the site itself.
//
// NOTE: src/lib/supabase.ts's Tool interface declares rating/reviewCount/featured.
// None of those columns exist on the table - selecting `rating` returns a 400.
// Real columns: affiliate_link, category, cons, created_at, description, features,
// generated, id, name, posted_at, posted_to_twitter, pricing, pros, published,
// review, slug, updated_at, website.

/** Keep the payload small - this ships to every visitor. */
const truncate = (s, n) => {
  const v = String(s || '').replace(/\s+/g, ' ').trim();
  return v.length > n ? v.slice(0, n - 1) + '…' : v;
};

// `website` and `affiliate_link` are deliberately NOT in this index. The site
// earns on the affiliate links that live on /tools/<slug>; handing an agent the
// vendor's own URL would route the visitor around the only monetised page.
// Agent tools return the ai-tools-hq URL, never the destination.
const tools = rows.map((t) => ({
  name: t.name,
  slug: t.slug,
  category: t.category,
  summary: truncate(t.description, 180),
  pricing: truncate(t.pricing, 60),
}));

const categories = [...new Set(tools.map((t) => t.category).filter(Boolean))].sort();

const out = fileURLToPath(new URL('../public/tools-index.json', import.meta.url));
writeFileSync(out, JSON.stringify({ generated_at: new Date().toISOString(), count: tools.length, categories, tools }, null, 0));

console.log(`wrote ${tools.length} tools across ${categories.length} categories -> public/tools-index.json`);
console.log(`size: ${(readFileSync(out).length / 1024).toFixed(1)} KB`);
