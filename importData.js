// importData.js
import { db } from './firebaseNode.js';
import { collection, addDoc } from "firebase/firestore";
import fs from 'fs';

// Read data.json
const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

async function importData() {
  try {
    for (const helpline of data) {
      await addDoc(collection(db, 'helplines'), helpline);
      console.log(`Imported: ${helpline.name.en}`);
    }
    console.log('All data imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

importData();
