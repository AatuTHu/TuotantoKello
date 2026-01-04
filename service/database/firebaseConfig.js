// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMS9dGAtr3cIToNm2wL5_Lftnzxgr1ZsY",
  authDomain: "tkkello.firebaseapp.com",
  projectId: "tkkello",
  storageBucket: "tkkello.firebasestorage.app",
  messagingSenderId: "501376882232",
  appId: "1:501376882232:web:61f6ca50b2a44d69d038cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
    db
}