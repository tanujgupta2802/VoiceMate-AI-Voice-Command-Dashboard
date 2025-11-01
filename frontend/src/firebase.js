import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_oNpGbxXkwz8ufz0NSvcLVVa8BC1bpKM",
  authDomain: "voicemate-f6421.firebaseapp.com",
  projectId: "voicemate-f6421",
  storageBucket: "voicemate-f6421.firebasestorage.app",
  messagingSenderId: "812114176912",
  appId: "1:812114176912:web:a86d8f1e987a6a6e892115",
  measurementId: "G-VHVDYL36Y2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
