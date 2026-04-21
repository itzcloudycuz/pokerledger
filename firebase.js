import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4aQWh8yc8bA6XQm5XWTq0EEQPKGynqBI",
  authDomain: "poker-ledger-pwa.firebaseapp.com",
  projectId: "poker-ledger-pwa",
  storageBucket: "poker-ledger-pwa.firebasestorage.app",
  messagingSenderId: "865251433349",
  appId: "1:865251433349:web:32fa9ec10555dd6f8102ec",
  measurementId: "G-S82B8G02N9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db;
window.doc = doc;
window.setDoc = setDoc;
window.onSnapshot = onSnapshot;
