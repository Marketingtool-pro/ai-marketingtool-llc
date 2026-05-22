import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQwN_gERNC3Hhm4PqQWBXQ9m1v1rYveew",
  authDomain: "marketing-tool-484720.firebaseapp.com",
  projectId: "marketing-tool-484720",
  storageBucket: "marketing-tool-484720.firebasestorage.app",
  messagingSenderId: "911925145433",
  appId: "1:911925145433:web:18d502cd9b2c2d5c112648",
  measurementId: "G-EDY5FPHF3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics };
