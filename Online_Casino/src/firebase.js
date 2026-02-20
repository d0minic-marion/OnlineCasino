import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAL2IEB1f_KU0yV1orE7Sgh7ARdkrfSbMU",
  authDomain: "casino-846b0.firebaseapp.com",
  projectId: "casino-846b0",
  storageBucket: "casino-846b0.firebasestorage.app",
  messagingSenderId: "113891868227",
  appId: "1:113891868227:web:966573c358f82d199fb636",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;