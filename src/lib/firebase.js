import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtZfC39nXaM_XEuVYvbaied_ZC1etQK-w",
  authDomain: "labottegadmin.firebaseapp.com",
  projectId: "labottegadmin",
  storageBucket: "labottegadmin.firebasestorage.app",
  messagingSenderId: "574292825454",
  appId: "1:574292825454:web:6ed6673b15c00f9eaf5d7f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
