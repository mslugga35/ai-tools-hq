/**
 * SEO Utility Functions
 * ====================
 * Shared helpers for schema markup, comparison page generation,
 * and sitemap building across the AI Tools HQ site.
 */

import type { Tool } from './supabase';

/**
 * Deterministic hash from a string.
 * Used to generate staggered publish dates and consistent per-tool values.
 *
 * @param str - Input string (typically a slug or slug pair)
 * @returns Non-negative integer hash
 */
export function slugHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit int
  }
  return Math.abs(hash);
}

/**
 * Generate a staggered datePublished string based on a slug hash.
 * Spreads dates across June 1 2025 – Jan 31 2026 (245 day window).
 *
 * @param slug - Tool slug or combined slug pair
 * @returns ISO date string (YYYY-MM-DD)
 */
export function getStaggeredDate(slug: string): string {
  const dayOffset = slugHash(slug) % 245;
  const date = new Date(2025, 5, 1); // June 1, 2025
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().split('T')[0];
}

/**
 * Group tools by category.
 *
 * @param tools - Array of Tool objects
 * @returns Record mapping category name to array of tools
 */
export function groupByCategory(tools: Tool[]): Record<string, Tool[]> {
  const groups: Record<string, Tool[]> = {};
  for (const tool of tools) {
    const cat = tool.category || 'Other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(tool);
  }
  return groups;
}

/**
 * Check if a tool has enough content for a meaningful comparison page.
 * Requires description > 20 chars and pros > 10 chars.
 *
 * @param tool - Tool to evaluate
 * @returns true if tool has substantive content
 */
export function hasSubstantiveContent(tool: Tool): boolean {
  return (tool.description?.length ?? 0) > 20 && (tool.pros?.length ?? 0) > 10;
}

/**
 * Generate same-category comparison pairs.
 * Returns alphabetically-ordered pairs where both tools have substantive content.
 * Used by the comparison page builder, sitemap, and anywhere we need the pair list.
 *
 * @param tools - All tools (will be filtered and sorted internally)
 * @returns Array of [toolA, toolB] pairs
 */
export function generateComparisonPairs(tools: Tool[]): [Tool, Tool][] {
  const byCategory = groupByCategory(tools.filter(t => t.slug));
  const pairs: [Tool, Tool][] = [];

  for (const catTools of Object.values(byCategory)) {
    const sorted = catTools.sort((a, b) => a.slug.localeCompare(b.slug));
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        if (hasSubstantiveContent(sorted[i]) && hasSubstantiveContent(sorted[j])) {
          pairs.push([sorted[i], sorted[j]]);
        }
      }
    }
  }

  return pairs;
}

/**
 * Split bullet-point text (from Supabase) into clean string array.
 * Handles newline-separated text with optional bullet markers.
 *
 * @param text - Raw text with newline-separated bullet points
 * @returns Array of trimmed, bullet-stripped strings (empty lines removed)
 */
export function splitBullets(text: string): string[] {
  if (!text) return [];
  return text.split('\n').filter(line => line.trim()).map(line => line.replace('•', '').trim());
}

/**
 * Escape HTML special characters to prevent XSS.
 * Use on any user/CMS content rendered with `set:html`.
 *
 * @param text - Untrusted text string
 * @returns HTML-safe string
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Safely serialize a JSON-LD object for use in <script type="application/ld+json" set:html={...}>.
 * Prevents script-injection attacks by replacing </script> with its unicode-escaped equivalent.
 * JSON.stringify alone does NOT escape HTML tags, so raw DB content could break out of the script block.
 *
 * @param obj - JSON-serializable object
 * @returns Safe JSON string
 */
export function safeJsonLd(obj: object): string {
  return JSON.stringify(obj).replace(/<\/script>/gi, '<\\/script>');
}

/**
 * Pricing classification keys and display colors.
 * Single source of truth for pricing badges, filters, and data attributes.
 */
export type PricingKey = 'free' | 'freemium' | 'paid' | 'free trial';

export interface PricingInfo {
  key: PricingKey;
  label: string;
  color: string;
}

const PRICING_RULES: { test: (p: string) => boolean; info: PricingInfo }[] = [
  { test: p => p.includes('free trial'),    info: { key: 'free trial', label: 'Free Trial', color: '#3b82f6' } },
  { test: p => p === 'free' || p.startsWith('free ('), info: { key: 'free', label: 'Free', color: '#10b981' } },
  { test: p => p.includes('freemium'),       info: { key: 'freemium', label: 'Freemium', color: '#eab308' } },
  { test: p => p.includes('free'),           info: { key: 'free', label: 'Free', color: '#10b981' } },
];

const PAID_DEFAULT: PricingInfo = { key: 'paid', label: 'Paid', color: '#6b7280' };

/**
 * Classify a tool's pricing string into a normalized key, display label, and badge color.
 *
 * @param pricing - Raw pricing string from Supabase (e.g. "Free", "Freemium", "From $20/mo")
 * @returns PricingInfo with key (for filtering), label (for display), and color (for badges)
 */
export function classifyPricing(pricing: string | undefined): PricingInfo {
  const p = (pricing || '').toLowerCase();
  for (const rule of PRICING_RULES) {
    if (rule.test(p)) return rule.info;
  }
  return PAID_DEFAULT;
}
