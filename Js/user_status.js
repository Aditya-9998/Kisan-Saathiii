// =======================
// user_status.js (FINAL MODULAR VERSION)
// =======================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC4rfGDs8BqZy6YAcXu7ccvTEMvudL8w4g",
  authDomain: "kisan-saathiii.firebaseapp.com",
  projectId: "kisan-saathiii",
  storageBucket: "kisan-saathiii.appspot.com",
  messagingSenderId: "1069746635685",
  appId: "1:1069746635685:web:b6cade8247e56094011e4c",
  measurementId: "G-XJ0T10GRND"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("🔥 user_status.js: Firebase initialized.");

// Wait for navbar to load first
document.addEventListener("navbarLoaded", initUserStatus);

// Backup fallback in case event doesn't fire
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initUserStatus, 400);
});

function initUserStatus() {
  console.log("🔍 Checking navbar elements...");

  const loginBtn = document.getElementById("login-btn");
  const userNameEl = document.getElementById("user-name");
  const logoutBtn = document.getElementById("logout-btn");

  // If navbar not loaded yet
  if (!loginBtn || !userNameEl) {
    console.warn("⏳ Navbar elements not ready — retrying...");
    return setTimeout(initUserStatus, 300);
  }

  console.log("✅ Navbar found. Starting auth listener...");

  // Firebase auth state listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // ------------------------
      // USER IS LOGGED IN
      // ------------------------

      const displayName =
        user.displayName || user.email?.split("@")[0] || "User";

      console.log("👤 Logged In as:", displayName);

      // Show Username / Hide Login
      loginBtn.style.display = "none";

      userNameEl.style.display = "inline-block";
      userNameEl.textContent = "Hey " + displayName;
      userNameEl.href = "profile.html";

      if (logoutBtn) {
        logoutBtn.style.display = "inline-block";
      }

      // Show login success toast
      if (sessionStorage.getItem("loginSuccess")) {
        sessionStorage.removeItem("loginSuccess");

        if (window.Swal) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: `Welcome back, ${displayName}!`,
            showConfirmButton: false,
            timer: 3000,
            background: "#e8ffe8",
          });
        }
      }

    } else {
      // ------------------------
      // USER IS LOGGED OUT
      // ------------------------

      console.log("🚫 User Logged Out");

      userNameEl.style.display = "none";
      loginBtn.style.display = "inline-block";

      if (logoutBtn) {
        logoutBtn.style.display = "none";
      }

      // Show logout success toast
      if (sessionStorage.getItem("logoutSuccess")) {
        sessionStorage.removeItem("logoutSuccess");

        if (window.Swal) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "You have logged out successfully.",
            showConfirmButton: false,
            timer: 3000,
            background: "#e8ffe8",
          });
        } else {
          alert("You have logged out successfully!");
        }
      }
    }
  });
}
