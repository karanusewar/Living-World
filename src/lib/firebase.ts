import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAzqrAq3GaxwnPxNiVed7JRs-vmzT0RW0Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "living-world-ad3d8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "living-world-ad3d8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "living-world-ad3d8.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "307793831875",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:307793831875:web:765f98b4f5ed38d996bf76",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DXNQ35ZCBC"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
