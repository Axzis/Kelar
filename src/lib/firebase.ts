
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz1yKoluYUgXs6-1HNE97sdBEMeTYahNg",
  authDomain: "kelar-67887.firebaseapp.com",
  projectId: "kelar-67887",
  storageBucket: "kelar-67887.firebasestorage.app",
  messagingSenderId: "906875295669",
  appId: "1:906875295669:web:039e4262931705135b2bfc"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
