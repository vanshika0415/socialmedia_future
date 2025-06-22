import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWNacQv7AG23CGRhIhp93gIXI05wrJZn0",
  authDomain: "socialmedia-a91fa.firebaseapp.com",
  projectId: "socialmedia-a91fa",
  storageBucket: "socialmedia-a91fa.firebasestorage.app",
  messagingSenderId: "1007255924185",
  appId: "1:1007255924185:web:4563299ea3e0b9e0953dc8",
  measurementId: "G-2TLTEEJ95X"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
