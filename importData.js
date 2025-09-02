// importData.js
import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf-8"));
// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount) // or use cert() with serviceAccountKey.json
});

const db = getFirestore();

// Load and parse data
const dataPath = path.join(__dirname, 'data.json');
const raw = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(raw);

// Validate required fields
const isValidEntry = (entry) => {
  // Check if entry exists and has required fields
  if (!entry || !entry.district || !entry.orgName || !entry.contact || !entry.language) {
    console.log('Missing required fields:', entry);
    return false;
  }

  // Check contact field (can be string or array of strings)
  const isContactValid = 
    typeof entry.contact === 'string' || 
    (Array.isArray(entry.contact) && entry.contact.every(c => typeof c === 'string'));

  // Check language structure
  const isLanguageValid = 
    entry.language &&
    entry.language.en && entry.language.en.orgName &&
    entry.language.pa && entry.language.pa.orgName;

  return isContactValid && isLanguageValid;
};

async function importData() {
  let successCount = 0;
  let failCount = 0;
  const batch = db.batch();
  const batchSize = 500; // Firestore batch limit is 500
  let batchCount = 0;
  let batchNumber = 1;

  console.log(`🚀 Starting import of ${data.length} helpline entries...\n`);
  console.log('🔍 Verifying Firebase connection...');

  try {
    // Test the connection
    await db.collection('test_connection').doc('test').get();
    console.log('✅ Successfully connected to Firestore');
  } catch (error) {
    console.error('❌ Failed to connect to Firestore. Please check your service account key and permissions.');
    console.error('Error details:', error.message);
    return;
  }

  for (const [index, helpline] of data.entries()) {
    if (!isValidEntry(helpline)) {
      console.warn(`⚠️ Skipped invalid entry at index ${index}:`);
      console.warn('Entry:', JSON.stringify(helpline, null, 2));
      failCount++;
      continue;
    }

    try {
      // Create a new doc reference with an auto-generated ID
      const docRef = db.collection('helplines').doc();
      batch.set(docRef, helpline);
      batchCount++;
      successCount++;

      // Commit batch if we reach batch size
      if (batchCount >= batchSize) {
        console.log(`📦 Committing batch ${batchNumber}...`);
        await batch.commit();
        batchCount = 0;
        batchNumber++;
      }

      console.log(`✅ Prepared [${successCount}]: ${helpline.language.en.orgName}`);
    } catch (error) {
      console.error(`❌ Failed to prepare entry at index ${index}:`, error.message);
      console.error('Error details:', error);
      failCount++;
    }
  }

  // Commit any remaining documents in the batch
  if (batchCount > 0) {
    try {
      console.log(`📦 Committing final batch...`);
      await batch.commit();
    } catch (error) {
      console.error('❌ Failed to commit final batch:', error.message);
      failCount += batchCount;
      successCount -= batchCount;
    }
  }

  console.log(`\n🎯 Import Summary`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📁 Source file: ${dataPath}`);
  console.log(`📦 Target collection: helplines`);
  
  if (failCount > 0) {
    console.log('\n🔍 Check the logs above for details on any failed imports.');
  }
}

importData();
