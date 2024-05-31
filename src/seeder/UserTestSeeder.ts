import firebaseConn from "../config/dbConnect";
import { getFirestore, doc, setDoc, addDoc, collection, getDocs, query, Firestore } from "firebase/firestore";

firebaseConn.initializeFirebaseApp();
firebaseConn.getFirestoreDB();


// create user seed data
const users = [
  {
    email: "dimasfad",
    password: "password123",
  },
  {
    email: "dimasfad",
    password: "password123",
  },
  {
    email: "dimasfad",
    password: "password123",
  },
  {
    email: "dimasfad",
    password: "password123",
  },
  {
    email: "dimasfad",
    password: "password123",
  },
];

const db = getFirestore();

const seedUsers = async () => {
  try {
    for (const user of users) {
      await addDoc(collection(db, 'users'), user);
    }
  } catch (error: any) {
    console.error("Error seeding users: ", error.message);
  }
};

export default seedUsers;