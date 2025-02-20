// If UID exists, redirect to the dashboard
const uid = localStorage.getItem('todo-uid');
if (uid) {
  window.location.replace('../index.html');  // Redirect to the dashboard
}
// // -----------------------------------------------------------------
import { auth } from '../firebaseConfig.js';
import {db} from '../firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup ,sendPasswordResetEmail, setDoc , doc} from "../firebaseConfig.js";

// --------------------------------------- AddData ---------------------------------------

let addUserData = async (user ,fullName ,phoneNumber ) => {
  try {
    const docRef = await setDoc(doc(db, "users", user.uid), {
      email: user.email,          // User's email
      uid: user.uid,              // User's UID
      displayName: fullName || user.displayName || 'No display name',  // User's display name
      photoURL: user.photoURL || 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg',      // User's profile photo URL (optional)
      phoneNumber: phoneNumber|| user.phoneNumber || 'No phone number', // User's phone number (optional)
      createdAt: new Date(),      // Timestamp when the user was created
    });
  } catch (e) {
    console.error("Error adding user data: ", e);
  }
};




// --------------------------------------- Signup ---------------------------------------
document.querySelector("#signup-btn").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const fullName = document.getElementById("fullName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user data to Firestore
    localStorage.setItem("todo-uid", user.uid);
    await addUserData(user, fullName, phoneNumber).then(() => {
      window.location.replace('../index.html');
    });
  } catch (error) {
    let errorMessage = "Something went wrong. Please try again.";

    // Handle specific Firebase signup errors
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already registered. Try logging in.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak. Please choose a stronger password.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email format. Please enter a valid email.";
    }
  
    showMessage(errorMessage);

  }
});



// --------------------------------------- login ---------------------------------------
document.querySelector("#login-btn").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user data to Firestore
    await addUserData(user);

    localStorage.setItem("todo-uid", user.uid);
    window.location.replace('../index.html');
  } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      }

      showMessage(errorMessage);
  }
});







// --------------------------------------- Signup with google ---------------------------------------

document.querySelector("#google-signUp").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Add user data to Firestore
    await addUserData(user);
    localStorage.setItem("todo-uid", user.uid);
    window.location.replace('../index.html');
  } catch (error) {
    alert("Google sign-in error: ", error);
    let errorMessage = "Something went wrong. Please try again.";

    // Handle specific Google sign-in errors
    if (error.code === "auth/popup-closed-by-user") {
      errorMessage = "Sign-in popup was closed before completing. Please try again.";
    } else if (error.code === "auth/cancelled-popup-request") {
      errorMessage = "Another sign-in popup was already open. Close it and try again.";
    } else if (error.code === "auth/account-exists-with-different-credential") {
      errorMessage = "This email is already linked to a different sign-in method.";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage = "Network error. Check your internet connection and try again.";
    }
    
    showMessage(errorMessage);
  }
});




// --------------------------------------- Reset Password ---------------------------------------
document.getElementById("resetPasswordBtn").addEventListener("click", async () => {
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();

  console.log("Email input value:", email); // Debugging log

  if (!email) {
    showMessage("Please enter your email address.", "error");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showMessage("Password reset email sent! Check your inbox.", "success");
  } catch (error) {
    console.error("Error:", error); // Log the entire error object for more context

    let errorMessage = "Something went wrong. Please try again.";
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage = "Invalid email format. Please enter a valid email.";
        break;
      case "auth/user-not-found":
        errorMessage = "No account found with this email. Please check and try again.";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many requests! Please try again later.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your internet connection.";
        break;
      case "auth/internal-error":
        errorMessage = "An unexpected error occurred. Please try again later.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again.";
        break;
    }

    showMessage(errorMessage, "error");
  }
});


// --------------------------------------- show msg Function ---------------------------------------
export function showMessage(message) {
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