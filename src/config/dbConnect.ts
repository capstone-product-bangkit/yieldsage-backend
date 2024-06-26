import { FirebaseApp, initializeApp } from "firebase/app";
import dotenv from "dotenv";
import { getFirestore, Firestore } from "firebase/firestore";
import { Sequelize } from "sequelize";
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";

dotenv.config();

// Firebase configuration
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
let storage: ReturnType<typeof getStorage>;

const initializeFirebaseApp = () => {
  try {
    console.log("Initializing Firebase app...");
    app = initializeApp(firebaseConfig);
    firestoreDB = getFirestore();
    storage = getStorage(app);
  } catch (error: any) {
    throw new Error(`Error initializing Firebase app: ${error.message}`);
  }
}

const getFirestoreDB = (): Firestore => {
  return firestoreDB;
};

const getStorageInstance = (): FirebaseStorage => {
  return storage;
}

// MySQL connection
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbHost = process.env.DB_HOST;
const dbDialect = "mysql";

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
  logging: console.log,
});

export default {
  getFirestoreDB,
  initializeFirebaseApp,
  sequelizeConnection,
  getStorageInstance,
}