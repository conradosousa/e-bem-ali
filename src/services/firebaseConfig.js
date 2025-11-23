// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPql3X_DeoQSwpGcf6E8ockXnlr6v3fNU",
  authDomain: "e-bem-ali.firebaseapp.com",
  projectId: "e-bem-ali",
  storageBucket: "e-bem-ali.firebasestorage.app",
  messagingSenderId: "967335387642",
  appId: "1:967335387642:web:d2313edc7999b5a1108443"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
