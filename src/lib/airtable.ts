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

export async function getAllTools(): Promise<Tool[]> {
  const records = await base('Tools')
    .select({
      filterByFormula: '{Published} = TRUE()',
      sort: [{ field: 'Name', direction: 'asc' }]
    })
    .all();

  return records.map(record => ({
    id: record.id,
    name: record.get('Name') as string,
    slug: record.get('Slug') as string,
    category: record.get('Category') as string,
    description: record.get('Description') as string,
    website: record.get('Website') as string,
    affiliateLink: record.get('Affiliate Link') as string || record.get('Website') as string,
    pricing: record.get('Pricing') as string,
    features: record.get('Features') as string,
    pros: record.get('Pros') as string,
    cons: record.get('Cons') as string,
    review: record.get('Review') as string,
  }));
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const records = await base('Tools')
    .select({
      filterByFormula: `AND({Slug} = '${slug}', {Published} = TRUE())`,
      maxRecords: 1
    })
    .all();

  if (records.length === 0) return null;

  const record = records[0];
  return {
    id: record.id,
    name: record.get('Name') as string,
    slug: record.get('Slug') as string,
    category: record.get('Category') as string,
    description: record.get('Description') as string,
    website: record.get('Website') as string,
    affiliateLink: record.get('Affiliate Link') as string || record.get('Website') as string,
    pricing: record.get('Pricing') as string,
    features: record.get('Features') as string,
    pros: record.get('Pros') as string,
    cons: record.get('Cons') as string,
    review: record.get('Review') as string,
  };
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  const records = await base('Tools')
    .select({
      filterByFormula: `AND({Category} = '${category}', {Published} = TRUE())`,
      sort: [{ field: 'Name', direction: 'asc' }]
    })
    .all();

  return records.map(record => ({
    id: record.id,
    name: record.get('Name') as string,
    slug: record.get('Slug') as string,
    category: record.get('Category') as string,
    description: record.get('Description') as string,
    website: record.get('Website') as string,
    affiliateLink: record.get('Affiliate Link') as string || record.get('Website') as string,
    pricing: record.get('Pricing') as string,
    features: record.get('Features') as string,
    pros: record.get('Pros') as string,
    cons: record.get('Cons') as string,
    review: record.get('Review') as string,
  }));
}

export async function getCategories(): Promise<string[]> {
  const tools = await getAllTools();
  const categories = [...new Set(tools.map(t => t.category))];
  return categories.sort();
}
