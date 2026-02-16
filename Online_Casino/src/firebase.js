// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAL2IEB1f_KU0yV1orE7Sgh7ARdkrfSbMU",
  authDomain: "casino-846b0.firebaseapp.com",
  projectId: "casino-846b0",
  storageBucket: "casino-846b0.firebasestorage.app",
  messagingSenderId: "118918068227",
  appId: "1:118918068227:web:966573c358f82d199fb636",
  measurementId: "G-PW4XMX1WNX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);