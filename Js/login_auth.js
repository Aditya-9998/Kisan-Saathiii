// =======================
// login_auth.js (FINAL MODULAR VERSION)
// =======================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  console.warn("Firebase already initialized:", e?.message || e);
}

const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const googleLoginBtn = document.getElementById("google-login-btn");
  const forgotPasswordLink = document.getElementById("forgot-password-link");

  const showStatus = window.showStatusPopup || (() => {});

  // Auto redirect if already authenticated on login page
  onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes("login.html")) {
      sessionStorage.setItem("loginSuccess", "true");
      showStatus("Redirecting...", true);
      setTimeout(() => (window.location.href = "index.html"), 800);
    }
  });

  // Email/password login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        showStatus("Please enter both email and password.", false);
        return;
      }

      showStatus("Checking credentials...", true);

      try {
        await signInWithEmailAndPassword(auth, email, password);

        const name = email.split("@")[0];
        sessionStorage.setItem("loginSuccess", "true");

        showStatus(`Welcome back, ${name}!`, true);
        setTimeout(() => (window.location.href = "index.html"), 900);

      } catch (err) {
        console.error(err);
        const msg =
          err.code === "auth/wrong-password" || err.code === "auth/user-not-found"
            ? "Incorrect email or password."
            : "Login failed. Try again.";
        showStatus(msg, false);
      }
    });
  }

  // Google login
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
      const provider = new GoogleAuthProvider();
      showStatus("Signing in with Google...", true);

      try {
        await signInWithPopup(auth, provider);

        sessionStorage.setItem("loginSuccess", "true");
        showStatus("Google login successful", true);

        setTimeout(() => (window.location.href = "index.html"), 800);
      } catch (err) {
        console.error(err);
        showStatus("Google sign-in failed.", false);
      }
    });
  }

  // Forgot password
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      if (!email) return showStatus("Enter your email first.", false);

      try {
        await sendPasswordResetEmail(auth, email);
        showStatus("Password reset email sent!", true, 5000);
      } catch (err) {
        console.error(err);
        showStatus("Unable to send reset email.", false);
      }
    });
  }
});
