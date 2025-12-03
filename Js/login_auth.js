// =======================
// login_auth.js (OPTION B - GOOGLE USERS GET FARMER ID + PASSWORD)
// =======================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ==========================================
// Firebase Config
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyC4rfGDs8BqZy6YAcXu7ccvTEMvudL8w4g",
  authDomain: "kisan-saathiii.firebaseapp.com",
  projectId: "kisan-saathiii",
  storageBucket: "kisan-saathiii.appspot.com",
  messagingSenderId: "1069746635685",
  appId: "1:1069746635685:web:b6cade8247e56094011e4c",
  measurementId: "G-XJ0T10GRND"
};

let app;
try { app = initializeApp(firebaseConfig); } 
catch (e) { console.log("Already initialized"); }

const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// Function: Generate Farmer ID
// ==========================================
function generateFarmerId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `FS-AGRI-${num}`;
}

// ==========================================
// Function: Generate Random Password
// ==========================================
function generateRandomPassword() {
  return Math.random().toString(36).slice(-8); // 8-char password
}

// ==========================================
// Farmer ID → Email
// ==========================================
async function farmerIdToEmail(farmerId) {
  const q = query(collection(db, "users"), where("farmerId", "==", farmerId));
  const snap = await getDocs(q);
  if (!snap.empty) return snap.docs[0].data().email;
  return null;
}

// ==========================================
// Google Login → Create Firestore User + Password
// ==========================================
async function handleGoogleUser(user) {
  const userDocRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userDocRef);

  if (!userSnap.exists()) {
    const farmerId = generateFarmerId();
    const autoPassword = generateRandomPassword();

    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      name: user.displayName || "",
      phone: user.phoneNumber || "",
      state: "",
      pincode: "",
      farmerId: farmerId,
      createdAt: new Date().toISOString(),
      password: autoPassword
    });

    // SET LOGIN PASSWORD FOR GOOGLE USER
    try {
      await updatePassword(user, autoPassword);
    } catch (err) {
      console.warn("Password update blocked until re-auth", err);
    }

    alert(
      "Welcome!\nYour Farmer ID: " + farmerId + 
      "\nYour Login Password: " + autoPassword +
      "\n\nPLEASE SAVE THIS PASSWORD!"
    );
  }
}

// ==========================================
// MAIN LOGIN SCRIPT
// ==========================================
document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const googleLoginBtn = document.getElementById("google-login-btn");

  // --------------------------
  // AUTO REDIRECT IF LOGGED IN
  // --------------------------
  onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes("login.html")) {
      window.location.href = "index.html";
    }
  });

  // --------------------------
  // EMAIL / FARMER ID LOGIN
  // --------------------------
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        alert("Please enter Email/Farmer ID & Password.");
        return;
      }

      // If user entered Farmer ID
      if (!email.includes("@")) {
        const foundEmail = await farmerIdToEmail(email);
        if (!foundEmail) {
          alert("Invalid Farmer ID.");
          return;
        }
        email = foundEmail;
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "index.html";
      } catch (err) {
        console.error(err);
        alert("Login failed. Check credentials.");
      }
    });
  }

  // --------------------------
  // GOOGLE LOGIN
  // --------------------------
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
      const provider = new GoogleAuthProvider();

      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        await handleGoogleUser(user);

        window.location.href = "index.html";

      } catch (err) {
        console.error("Google Login Error:", err);
      }
    });
  }
});
