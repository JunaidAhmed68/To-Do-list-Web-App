// Import Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup,sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc ,query, where, collection , getDocs ,addDoc,deleteDoc,orderBy,updateDoc,serverTimestamp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBdLy5fl1RQxKLgiotZ-0tTO8ewQvxxFXI",
  authDomain: "to-do-list-84ea2.firebaseapp.com",
  projectId: "to-do-list-84ea2",
  storageBucket: "to-do-list-84ea2.firebasestorage.app",
  messagingSenderId: "735945921679",
  appId: "1:735945921679:web:2288d7227e8593efe94cfa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);




//  msg function
function showMessage(message) {
  const msgModal = document.getElementById("msg-modal");
  const msgText = document.getElementById("msg-text");

  msgText.textContent = message; // Set the message content
  msgModal.style.display = 'block';  // Show the modal

  // Add the fade animation class for smooth appearance and disappearance
  msgModal.classList.add("fade");

  // After 3 seconds, hide the modal again
  setTimeout(() => {
    msgModal.style.display = 'none';
    msgModal.classList.remove("fade");  // Remove animation class for next use
  }, 3000);  // Hide after 3 seconds
}






export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  query,
  where,
  getDocs,
  signInWithPopup,
  doc,
  showMessage,
  setDoc,
  getDoc,
  addDoc,
  sendPasswordResetEmail,
  collection,
  getFirestore,
  auth,
  db,
  orderBy,
  deleteDoc,
  updateDoc,
  serverTimestamp
};