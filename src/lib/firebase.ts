// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "superapp-mvp-proposal",
  "appId": "1:552824195923:web:7a77ccdff6b4940da0efa6",
  "storageBucket": "superapp-mvp-proposal.firebasestorage.app",
  "apiKey": "AIzaSyAXNgCPFmZ8_61Ru0iZUes7HtgM1ev18oY",
  "authDomain": "superapp-mvp-proposal.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "552824195923"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, firestore, googleProvider, signInWithPopup };
