// Supabase integration for AI Tools HQ
// Replaces Airtable - all 99 tools now accessible

const SUPABASE_URL = import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

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
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!res.ok) {
    console.error(`Supabase error: ${res.status} ${res.statusText}`);
    return [];
  }
  
  return res.json();
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
