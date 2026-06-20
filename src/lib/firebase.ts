import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyARArGSd3uBUJrJDHzrpQ6DjkkmW6avzmQ",
  authDomain: "studio-2826885822-a9563.firebaseapp.com",
  projectId: "studio-2826885822-a9563",
  storageBucket: "studio-2826885822-a9563.firebasestorage.app",
  messagingSenderId: "1038662747761",
  appId: "1:1038662747761:web:73d0e6471165692f0cfdd0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);