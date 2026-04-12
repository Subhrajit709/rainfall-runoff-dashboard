import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_REAL_API_KEY",
  authDomain: "YOUR_REAL_AUTH_DOMAIN",
  projectId: "YOUR_REAL_PROJECT_ID",
  storageBucket: "YOUR_REAL_BUCKET",
  messagingSenderId: "YOUR_REAL_ID",
  appId: "YOUR_REAL_APP_ID",
};

const app = initializeApp(firebaseConfig);

// ✅ IMPORTANT EXPORTS
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();