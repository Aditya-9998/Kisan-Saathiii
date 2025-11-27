// ==========================
// logout.js (FINAL MODULAR VERSION)
// ==========================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

// Initialize Firebase (safe if already initialized)
let app;
try {
  app = initializeApp(firebaseConfig);
} catch {
  app = getApp();
}

const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");

  if (!logoutBtn) {
    console.warn("⚠ logout-btn not found on this page.");
    return;
  }

  logoutBtn.addEventListener("click", async () => {
    try {
      console.log("🚪 Logging out...");

      await signOut(auth);

      // Save flag for user_status.js to show toast
      sessionStorage.setItem("logoutSuccess", "true");

      // Redirect after logout
      window.location.href = "index.html";

    } catch (error) {
      console.error("❌ Logout Error:", error);
      alert("Logout failed. Please try again.");
    }
  });
});
