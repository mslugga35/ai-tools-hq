import Airtable from 'airtable';

// Validate environment variables at startup
const AIRTABLE_API_KEY = import.meta.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || typeof AIRTABLE_API_KEY !== 'string') {
  throw new Error('Missing or invalid AIRTABLE_API_KEY environment variable');
}
if (!AIRTABLE_BASE_ID || typeof AIRTABLE_BASE_ID !== 'string') {
  throw new Error('Missing or invalid AIRTABLE_BASE_ID environment variable');
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY })
  .base(AIRTABLE_BASE_ID);

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
  // Escape single quotes by doubling them (Airtable formula syntax uses '')
  // Remove any characters that could break the formula
  return input
    .replace(/'/g, "''")           // Airtable uses '' to escape single quotes
    .replace(/[\n\r\t\\]/g, ' ')   // Remove newlines, tabs, and backslashes
    .replace(/[{}[\]()]/g, '')     // Remove brackets that could break formulas
    .trim()
    .slice(0, 200); // Limit length to prevent abuse
}

/**
 * Safely extract string value from Airtable field
 * Handles arrays (linked records, lookups), objects, and primitives
 */
function getStringValue(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    // Linked records or lookups return arrays - take first item
    const first = value[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && 'name' in first) return first.name as string;
    return '';
  }
  if (typeof value === 'object' && value !== null) {
    // Attachment or other object - try to get name or url
    if ('name' in value) return (value as { name: string }).name;
    if ('url' in value) return (value as { url: string }).url;
  }
  return '';
}

/**
 * Map Airtable record to Tool interface
 * Centralized to avoid code duplication
 */
function mapRecordToTool(record: Airtable.Record<Airtable.FieldSet>): Tool {
  return {
    id: record.id,
    name: getStringValue(record.get('Name')),
    slug: getStringValue(record.get('Slug')),
    category: getStringValue(record.get('Category')),
    description: getStringValue(record.get('Description')),
    website: getStringValue(record.get('Website')),
    affiliateLink: getStringValue(record.get('Affiliate Link')) || getStringValue(record.get('Website')),
    pricing: getStringValue(record.get('Pricing')),
    features: getStringValue(record.get('Features')),
    pros: getStringValue(record.get('Pros')),
    cons: getStringValue(record.get('Cons')),
    review: getStringValue(record.get('Review')),
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
