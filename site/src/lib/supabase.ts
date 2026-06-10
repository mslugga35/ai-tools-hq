/**
 * Supabase Data Layer for AI Tools HQ
 * ====================================
 *
 * This module handles all database operations for the tools catalog.
 *
 * Data Source: Supabase PostgreSQL (ebhtzgimevacvcgiyesc.supabase.co)
 * Table: `tools` (129 AI tools with generated content)
 *
 * Security Note:
 * - Uses anon key (public, read-only access) - safe to expose in client
 * - Row Level Security (RLS) enabled on Supabase
 * - Only generated=true tools are fetched (published tools)
 *
 * @author Damian (AI Tools HQ)
 * @version 2.1.0
 * @lastUpdated 2026-02-06
 */

// Supabase configuration
// Note: Anon key is intentionally exposed - it's designed for public/read access
// RLS policies on Supabase ensure data security
const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing required Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY');
}

const FETCH_TIMEOUT_MS = 15000;

/**
 * Tool data structure
 * Maps to the `tools` table in Supabase
 */
export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  website: string;
  affiliateLink: string;
  pricing: string;
  features: string;
  pros: string;
  cons: string;
  review: string;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  created_at?: string;
}

// ============================================
// Build-time request cache (prevents duplicate fetches)
// ============================================
const requestCache = new Map<string, any>();

/**
 * Generic Supabase REST API fetcher with timeout and caching
 *
 * @param endpoint - Supabase REST endpoint (e.g., 'tools?select=*')
 * @returns Parsed JSON data or empty array on error
 */
async function supabaseFetch<T = any>(endpoint: string): Promise<T[]> {
  // Return cached result if available
  if (requestCache.has(endpoint)) {
    return requestCache.get(endpoint);
  }

  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    if (!res.ok) {
      console.error(`[Supabase] Error fetching ${endpoint}: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    requestCache.set(endpoint, data);
    return data;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error(`[Supabase] Timeout after ${FETCH_TIMEOUT_MS}ms fetching ${endpoint}`);
    } else {
      console.error(`[Supabase] Fetch failed for ${endpoint}:`, err);
    }
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Maps raw Supabase record to Tool interface
 * Handles field name differences (snake_case -> camelCase)
 *
 * @param record - Raw database record
 * @returns Normalized Tool object
 */
function mapTool(record: any): Tool {
  return {
    id: record.id?.toString() ?? record.slug,
    name: record.name || '',
    slug: record.slug || '',
    category: record.category || 'Other',
    description: record.description || '',
    website: record.website || '',
    affiliateLink: record.affiliate_link || record.website || '',
    pricing: record.pricing || 'Contact for pricing',
    features: record.features || '',
    pros: record.pros || '',
    cons: record.cons || '',
    review: record.review || '',
    rating: record.rating ?? undefined,
    reviewCount: record.review_count ?? undefined,
    featured: record.featured === true,
    created_at: record.created_at ?? undefined,
  };
}

// ============================================
// Public API Functions
// ============================================

/**
 * Fetches all published tools
 * Only returns tools where generated=true (content has been generated)
 * Results are cached for the duration of the build.
 *
 * @returns Array of Tool objects sorted by name
 */
export async function getAllTools(): Promise<Tool[]> {
  const data = await supabaseFetch('tools?select=*&generated=eq.true&order=name.asc');
  return data.map(mapTool);
}

/**
 * Fetches a single tool by its URL slug
 *
 * @param slug - URL-friendly tool identifier (e.g., 'chatgpt')
 * @returns Tool object or null if not found
 */
export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const data = await supabaseFetch(`tools?slug=eq.${encodeURIComponent(slug)}&limit=1`);
  if (!data || data.length === 0) return null;
  return mapTool(data[0]);
}

/**
 * Fetches all tools in a specific category
 *
 * @param category - Category name (e.g., 'Writing', 'Image', 'Video')
 * @returns Array of Tool objects in that category
 */
export async function getToolsByCategory(category: string): Promise<Tool[]> {
  const data = await supabaseFetch(`tools?category=eq.${encodeURIComponent(category)}&generated=eq.true&order=name.asc`);
  return data.map(mapTool);
}

/**
 * Gets all unique categories from published tools
 * Uses getAllTools cache to avoid duplicate requests.
 *
 * @returns Sorted array of category names
 */
export async function getCategories(): Promise<string[]> {
  const tools = await getAllTools();
  const categories = [...new Set(tools.map(t => t.category).filter(Boolean))];
  return categories.sort();
}

/**
 * Gets all tool slugs (for static generation)
 * Used by Astro's getStaticPaths()
 *
 * @returns Array of slug strings
 */
export async function getAllSlugs(): Promise<string[]> {
  const data = await supabaseFetch('tools?select=slug&generated=eq.true');
  return data.map((t: any) => t.slug).filter(Boolean);
}
