import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { firebaseConfig } from "../firebase.js";

// Read and parse the JSON file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const data = JSON.parse(readFileSync(join(__dirname, 'data.json'), 'utf-8'));

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to import data
const importData = async () => {
  try {
    const batch = writeBatch(db);
    const colRef = collection(db, "helplinenumbers"); // single collection

    data.forEach(item => {
      const docRef = doc(colRef); // auto-generated ID
      batch.set(docRef, item);
    });

    await batch.commit();
    console.log("✅ Data imported successfully!");
  } catch (error) {
    console.error("❌ Error importing data:", error);
  }
};

// Run the import
importData();
