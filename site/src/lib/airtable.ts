import Airtable from 'airtable';

const base = new Airtable({ apiKey: import.meta.env.AIRTABLE_API_KEY })
  .base(import.meta.env.AIRTABLE_BASE_ID);

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

/**
 * Sanitize string for Airtable formula to prevent formula injection
 * Escapes single quotes and removes potentially dangerous characters
 */
function sanitizeForFormula(input: string): string {
  if (!input || typeof input !== 'string') return '';
  // Escape single quotes by doubling them (Airtable formula syntax)
  // Remove any characters that could break the formula
  return input
    .replace(/'/g, "\\'")
    .replace(/[\n\r\t]/g, ' ')
    .slice(0, 200); // Limit length to prevent abuse
}

/**
 * Map Airtable record to Tool interface
 * Centralized to avoid code duplication
 */
function mapRecordToTool(record: Airtable.Record<Airtable.FieldSet>): Tool {
  return {
    id: record.id,
    name: (record.get('Name') as string) || '',
    slug: (record.get('Slug') as string) || '',
    category: (record.get('Category') as string) || '',
    description: (record.get('Description') as string) || '',
    website: (record.get('Website') as string) || '',
    affiliateLink: (record.get('Affiliate Link') as string) || (record.get('Website') as string) || '',
    pricing: (record.get('Pricing') as string) || '',
    features: (record.get('Features') as string) || '',
    pros: (record.get('Pros') as string) || '',
    cons: (record.get('Cons') as string) || '',
    review: (record.get('Review') as string) || '',
  };
}

// Simple in-memory cache for categories (refreshes on cold start)
let categoriesCache: string[] | null = null;
let categoriesCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getAllTools(): Promise<Tool[]> {
  try {
    const records = await base('Tools')
      .select({
        filterByFormula: '{Published} = TRUE()',
        sort: [{ field: 'Name', direction: 'asc' }]
      })
      .all();

    return records.map(mapRecordToTool);
  } catch (error) {
    console.error('Error fetching all tools:', error);
    return [];
  }
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  try {
    const sanitizedSlug = sanitizeForFormula(slug);
    if (!sanitizedSlug) return null;

    const records = await base('Tools')
      .select({
        filterByFormula: `AND({Slug} = '${sanitizedSlug}', {Published} = TRUE())`,
        maxRecords: 1
      })
      .all();

    if (records.length === 0) return null;
    return mapRecordToTool(records[0]);
  } catch (error) {
    console.error('Error fetching tool by slug:', error);
    return null;
  }
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  try {
    const sanitizedCategory = sanitizeForFormula(category);
    if (!sanitizedCategory) return [];

    const records = await base('Tools')
      .select({
        filterByFormula: `AND({Category} = '${sanitizedCategory}', {Published} = TRUE())`,
        sort: [{ field: 'Name', direction: 'asc' }]
      })
      .all();

    return records.map(mapRecordToTool);
  } catch (error) {
    console.error('Error fetching tools by category:', error);
    return [];
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    // Return cached categories if still valid
    const now = Date.now();
    if (categoriesCache && (now - categoriesCacheTime) < CACHE_TTL) {
      return categoriesCache;
    }

    const tools = await getAllTools();
    const categories = [...new Set(tools.map(t => t.category).filter(Boolean))];

    // Update cache
    categoriesCache = categories.sort();
    categoriesCacheTime = now;

    return categoriesCache;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return categoriesCache || [];
  }
}
