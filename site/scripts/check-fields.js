/**
 * Check Airtable field names by fetching existing records
 */
import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

async function checkFields() {
  console.log('🔍 Checking Airtable field names...\n');

  try {
    const records = await base('Tools').select({ maxRecords: 1 }).all();

    if (records.length === 0) {
      console.log('No records found. Trying to create with common field names...');
      return null;
    }

    const record = records[0];
    console.log('Found record ID:', record.id);
    console.log('\nField names in your Airtable:');
    console.log('─'.repeat(40));

    const fields = record.fields;
    for (const [key, value] of Object.entries(fields)) {
      const preview = typeof value === 'string' ? value.substring(0, 50) : value;
      console.log(`  "${key}": ${preview}`);
    }

    return Object.keys(fields);
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

checkFields();
