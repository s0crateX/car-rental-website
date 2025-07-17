// Import the functions you need from the SDKs you need 
import { initializeApp } from "firebase/app"; 
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use 
// https://firebase.google.com/docs/web/setup#available-libraries  

// Your web app's Firebase configuration 
// For Firebase JS SDK v7.20.0 and later, measurementId is optional 
const firebaseConfig = { 
  apiKey: "AIzaSyBNWV9EGRPyKLcuNpWe9f8yoXpZMexXVBo", 
  authDomain: "car-rental-system-28770.firebaseapp.com", 
  projectId: "car-rental-system-28770", 
  storageBucket: "car-rental-system-28770.appspot.com", 
  messagingSenderId: "17519697989", 
  appId: "1:17519697989:web:d102f21a302a075621832c", 
  measurementId: "G-3SV0D5LVYF" 
}; 

// Initialize Firebase 
const app = initializeApp(firebaseConfig); 
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

export { app, analytics, db };