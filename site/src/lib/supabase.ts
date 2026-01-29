// Supabase integration for AI Tools HQ
// Replaces Airtable - all 99 tools now accessible

// Hardcoded for build - env vars not working on Vercel
const SUPABASE_URL = 'https://ebhtzgimevacvcgiyesc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViaHR6Z2ltZXZhY3ZjZ2l5ZXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDIyMTksImV4cCI6MjA2ODM3ODIxOX0.msMqXGX33MIygHQWG4n2BdP8JVLOR9Yi5WkiDRwZEbY';

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
}

async function supabaseFetch(endpoint: string) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  console.log('[BUILD] Fetching:', url);
  
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('[BUILD] Response status:', res.status);
    
    if (!res.ok) {
      console.error(`[BUILD] Supabase error: ${res.status} ${res.statusText}`);
      return [];
    }
    
    const data = await res.json();
    console.log('[BUILD] Got', Array.isArray(data) ? data.length : 'non-array', 'results');
    return data;
  } catch (err) {
    console.error('[BUILD] Fetch failed:', err);
    return [];
  }
}

function mapTool(record: any): Tool {
  return {
    id: record.id?.toString() || record.slug,
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
  };
}

export async function getAllTools(): Promise<Tool[]> {
  const data = await supabaseFetch('tools?select=*&generated=eq.true&order=name.asc');
  return data.map(mapTool);
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const data = await supabaseFetch(`tools?slug=eq.${slug}&limit=1`);
  if (!data || data.length === 0) return null;
  return mapTool(data[0]);
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  const data = await supabaseFetch(`tools?category=eq.${encodeURIComponent(category)}&generated=eq.true&order=name.asc`);
  return data.map(mapTool);
}

export async function getCategories(): Promise<string[]> {
  const tools = await getAllTools();
  const categories = [...new Set(tools.map(t => t.category).filter(Boolean))];
  return categories.sort();
}

// For static generation - get all slugs
export async function getAllSlugs(): Promise<string[]> {
  const data = await supabaseFetch('tools?select=slug&generated=eq.true');
  return data.map((t: any) => t.slug).filter(Boolean);
}
