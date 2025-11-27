// =======================
// user_status.js (FINAL CLEAN VERSION)
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("🔥 user_status.js: Firebase initialized.");

document.addEventListener("navbarLoaded", initUserStatus);
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initUserStatus, 400);
});

function initUserStatus() {
  console.log("🔍 Checking navbar elements...");

  const loginBtn = document.getElementById("login-btn");
  const userNameEl = document.getElementById("user-name");

  if (!loginBtn || !userNameEl) {
    console.warn("⚠ Navbar elements missing. Retrying...");
    setTimeout(initUserStatus, 300);
    return;
  }

  console.log("✅ Navbar elements found. Starting auth listener...");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const displayName = user.displayName || user.email?.split("@")[0] || "User";

      console.log("👤 Logged In as:", displayName);

      loginBtn.style.display = "none";

      userNameEl.style.display = "inline-block";
      userNameEl.textContent = "Hey " + displayName;
      userNameEl.href = "profile.html";

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
      console.log("🚫 User Logged Out");

      userNameEl.style.display = "none";
      loginBtn.style.display = "inline-block";

      if (sessionStorage.getItem("logoutSuccess")) {
        sessionStorage.removeItem("logoutSuccess");

        if (window.Swal) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "You have logged out.",
            showConfirmButton: false,
            timer: 3000,
            background: "#e8ffe8",
          });
        }
      }
    }
  });
}
