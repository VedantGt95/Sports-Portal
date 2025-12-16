import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAanfAsWvAe30kIxdX1p20P-yz_K9xtgFU",
  authDomain: "avahanregistrationportal-dd699.firebaseapp.com",
  databaseURL: "https://avahanregistrationportal-dd699-default-rtdb.firebaseio.com",
  projectId: "avahanregistrationportal-dd699",
  storageBucket: "avahanregistrationportal-dd699.firebasestorage.app",
  messagingSenderId: "867411226138",
  appId: "1:867411226138:web:020347cb96dfb610bb6ba3",
  measurementId: "G-BPD30BR122"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
