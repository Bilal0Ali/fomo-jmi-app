
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAGuHZsPpTCEHrVMUhTxJxG8EF4Hs3fI9o",
  authDomain: "jmi-study-hub.firebaseapp.com",
  projectId: "jmi-study-hub",
  storageBucket: "jmi-study-hub.appspot.com",
  messagingSenderId: "110020009088",
  appId: "1:110020009088:web:56c1e35adabf7dedb9da65"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
