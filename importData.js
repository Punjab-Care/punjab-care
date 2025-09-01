// importData.js
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
initializeApp({
  credential: applicationDefault() // or use cert() with serviceAccountKey.json
});

const db = getFirestore();

// Load and parse data
const dataPath = path.join(__dirname, 'data.json');
const raw = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(raw);

// Validate required fields
const isValidEntry = (entry) =>
  entry &&
  typeof entry.district === 'string' &&
  typeof entry.orgName === 'string' &&
  typeof entry.contact === 'string' &&
  entry.language &&
  typeof entry.language.en?.orgName === 'string' &&
  typeof entry.language.pa?.orgName === 'string';

async function importData() {
  let successCount = 0;
  let failCount = 0;

  console.log(`🚀 Starting import of ${data.length} helpline entries...\n`);

  for (const [index, helpline] of data.entries()) {
    if (!isValidEntry(helpline)) {
      console.warn(`⚠️ Skipped invalid entry at index ${index}:`, helpline);
      failCount++;
      continue;
    }

    try {
      await db.collection('helplines').add(helpline);
      console.log(`✅ Imported [${successCount + 1}]: ${helpline.language.en.orgName}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to import entry at index ${index}:`, error.message);
      failCount++;
    }
  }

  console.log(`\n🎯 Import Summary`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📁 Source file: ${dataPath}`);
  console.log(`📦 Target collection: helplines`);
}

importData();
