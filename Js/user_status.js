// Js/user_status.js — Production Version for Kisan Saathii
// Modular Firebase v10 + Auth Logic with Error Guards

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Initialize Firebase (idempotent - safe to call multiple times)
const firebaseConfig = {
  apiKey: "AIzaSyC4rfGDs8BqZy6YAcXu7ccvTEMvudL8w4g",
  authDomain: "kisan-saathiii.firebaseapp.com",
  projectId: "kisan-saathiii",
  storageBucket: "kisan-saathiii.appspot.com",
  messagingSenderId: "1069746635685",
  appId: "1:1069746635685:web:b6cade8247e56094011e4c",
  measurementId: "G-XJ0T10GRND",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("🔥 Firebase initialized successfully for Kisan Saathii");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM fully loaded - starting user status script...");

  // ✅ Fallbacks for missing globals
  const Swal = window.Swal || console.log;  // Use console if SweetAlert missing
  const popup = window.showStatusPopup || ((msg, isSuccess) => console.log(`${isSuccess ? '✅' : '❌'} ${msg}`));
  const getTranslatedText = (key, fallback) => {
    const t = window.currentTranslations || {};
    return key.split(".").reduce((acc, k) => (acc && acc[k] ? acc[k] : null), t) || fallback;
  };

  // ✅ Wait for navbar elements (longer delay + retry)
  const initUserStatus = () => {
    console.log("🔍 Looking for navbar elements...");
    const userName = document.getElementById("user-name");
    const logoutBtn = document.getElementById("logout-btn");

    if (!userName) console.warn("⚠️ Element with ID 'user-name' not found! (Check navbar.js)");
    else console.log("✅ Found #user-name element");

    if (!logoutBtn) console.warn("⚠️ Element with ID 'logout-btn' not found! (Check navbar.js)");
    else console.log("✅ Found #logout-btn element");

    // ===== Logout Handler =====
    const handleLogout = (e) => {
      if (e) e.preventDefault();
      console.log("🚪 Logout button clicked!");
      popup(getTranslatedText("navbar.loggingOut", "Logging out..."), true, 800);

      signOut(auth)
        .then(() => {
          console.log("✅ Firebase signOut() successful");
          sessionStorage.setItem("logoutSuccess", "true");
          if (typeof Swal.fire === 'function') {
            Swal.fire({
              icon: "success",
              title: getTranslatedText("navbar.logoutSuccessTitle", "🌿 Logout Successful!"),
              text: getTranslatedText("navbar.logoutSuccessText", "आप सफलतापूर्वक लॉग आउट हो गए हैं।"),
              confirmButtonColor: "#22c55e",
              timer: 1800,
              showConfirmButton: false,
            });
          }
          setTimeout(() => {
            console.log("🔄 Redirecting to index.html...");
            window.location.href = "index.html";
          }, 1600);
        })
        .catch((err) => {
          console.error("❌ Logout Error:", err);
          popup(getTranslatedText("navbar.logoutFailed", "Logout failed. Please try again."), false);
        });
    };

    // ===== Attach Logout if Element Exists =====
    if (logoutBtn) {
      logoutBtn.removeEventListener("click", handleLogout);  // Prevent duplicates
      logoutBtn.addEventListener("click", handleLogout);
      console.log("🔗 Logout handler attached");
    }

    // ===== Firebase Auth State Listener =====
    onAuthStateChanged(auth, (user) => {
      console.log("👤 Firebase Auth State Changed:", user ? `User Logged In: ${user.uid}` : "No User");

      if (user) {
        const name = user.displayName || (user.email ? user.email.split("@")[0] : "Unknown User");
        console.log("✅ Logged in as:", name);

        if (userName) {
          userName.textContent = name;
          userName.href = "profile.html";
          userName.style.cursor = "pointer";  // Ensure clickable
        }

        // Show login success message once (if flag set)
        const loginSuccess = sessionStorage.getItem("loginSuccess");
        if (loginSuccess === "true") {
          sessionStorage.removeItem("loginSuccess");
          console.log("🎉 Showing login success toast...");
          if (typeof Swal.fire === 'function') {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: getTranslatedText("navbar.loginSuccessTitle", "Login Successful!"),
              text: getTranslatedText("navbar.loginSuccessText", "आप सफलतापूर्वक लॉग इन हो गए हैं।"),
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              background: "#f0fdf4",
            });
          }
        }
      } else {
        console.log("🚫 User not logged in");
        if (userName) {
          userName.textContent = getTranslatedText("navbar.loginSignup", "Login / Signup");
          userName.href = "login.html";
          console.log("🔗 userName link set to Login / Signup");
        }
      }
    });
  };

  // Retry init if elements missing (e.g., navbar.js delay)
  setTimeout(initUserStatus, 500);

  // ===== Handle Post-Logout Toast =====
  const logoutSuccess = sessionStorage.getItem("logoutSuccess");
  if (logoutSuccess === "true") {
    sessionStorage.removeItem("logoutSuccess");
    console.log("✅ Detected logoutSuccess flag - showing toast...");
    setTimeout(() => {
      if (typeof Swal.fire === 'function') {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: getTranslatedText("navbar.loggedOutTitle", "✅ You have been successfully logged out."),
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#f0fdf4",
        });
      }
    }, 600);
  }
});