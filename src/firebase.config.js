// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOLL814d77xe58kc2ShQdTdd8u71F20yM",
  authDomain: "car-rental-1e93a.firebaseapp.com",
  projectId: "car-rental-1e93a",
  storageBucket: "car-rental-1e93a.appspot.com",
  messagingSenderId: "683126888476",
  appId: "1:683126888476:web:5a3caaee6439988d6327d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db= getFirestore()