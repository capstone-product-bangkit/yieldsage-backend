import { FirebaseApp, initializeApp } from "firebase/app";
import dotenv from "dotenv";
import { getFirestore, Firestore } from "firebase/firestore";


dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

let app: FirebaseApp;
let firestoreDB: Firestore;

const initializeFirebaseApp = () => {
  try {
    console.log("Initializing Firebase app...");
    app = initializeApp(firebaseConfig);
    firestoreDB = getFirestore();
  } catch (error: any) {
    throw new Error(`Error initializing Firebase app: ${error.message}`);
  }
}

const getFirestoreDB = (): Firestore => {
  return firestoreDB;
};

export default {
  getFirestoreDB,
  initializeFirebaseApp
}