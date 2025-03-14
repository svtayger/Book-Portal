// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7HC4EVKbOrizbuNXuKY1Ho9bp2OQ7nl0",
  authDomain: "cse6214-book.firebaseapp.com",
  projectId: "cse6214-book",
  storageBucket: "cse6214-book.firebaseapp.com",
  messagingSenderId: "684243914242",
  appId: "1:684243914242:web:0e68b2fe9ae650751ca11b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore instance
