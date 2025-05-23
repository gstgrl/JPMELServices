import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsUDkZVgHgt955d9WlQ1lSNY6R8Agw1Zc",
  authDomain: "jp-mel-services.firebaseapp.com",
  projectId: "jp-mel-services",
  storageBucket: "jp-mel-services.firebasestorage.app",
  messagingSenderId: "229101122985",
  appId: "1:229101122985:web:03c767a143417d6b22c0b8",
  measurementId: "G-VPRF10ZS2Z"
};

// Inizializza Firebase e Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, signOut, onAuthStateChanged };
