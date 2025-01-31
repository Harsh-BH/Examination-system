// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApE_zM6QHfeSDUlLNFEVlds91sK9t-P7c",
  authDomain: "exam-centre-f8ab0.firebaseapp.com",
  projectId: "exam-centre-f8ab0",
  storageBucket: "exam-centre-f8ab0.appspot.com",
  messagingSenderId: "834949400157",
  appId: "1:834949400157:web:71b2b0e8e2cdbcfe3eefb4",
  measurementId: "G-6L0027FN4S",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
