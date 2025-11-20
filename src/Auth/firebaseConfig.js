import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDI7x-vFs5QU1zgOna6S24IUsHXzRlH9Po",
  authDomain: "jira--teams-application.firebaseapp.com",
  projectId: "jira--teams-application", // shared within the project
  storageBucket: "jira--teams-application.firebasestorage.app", // shared with the projst
  messagingSenderId: "352357560678",
  appId: "1:352357560678:web:5ffa362d9c3761c3fe98a7", // unique to an application
  measurementId: "G-2ML2GKX829",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
console.log(" firebase intiialization");

// JIRA - Teams Application  => TEST
