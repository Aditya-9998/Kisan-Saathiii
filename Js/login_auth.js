// Js/login_auth.js — FINAL VERIFIED VERSION for Kisaan Saathii Project

document.addEventListener('DOMContentLoaded', () => {

    // Ensure Firebase Auth is loaded
    if (typeof window.firebaseAuth === 'undefined') {
        console.error("❌ Firebase Auth not initialized. Make sure firebase.js is loaded before login_auth.js");
        return;
    }

    const auth = window.firebaseAuth;

    // UI Elements
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const forgotPasswordLink = document.getElementById('forgot-password-link');

    // Hide any old static message element
    const messageDisplay = document.getElementById('auth-message');
    if (messageDisplay) messageDisplay.style.display = 'none';

    // Use showStatusPopup from utility.js
    const showStatusPopup = window.showStatusPopup;

    // 🔹 Handle Firebase errors with user-friendly messages
    function handleAuthError(error, isGoogle = false) {
        let errorMessage = 'Login failed. Please try again.';

        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-login-credentials':
                errorMessage = "Incorrect email or password.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Please enter a valid email address.";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Too many failed attempts. Try again later.";
                break;
            case 'auth/network-request-failed':
                errorMessage = "Network issue. Please check your internet connection.";
                break;
            case 'auth/popup-closed-by-user':
                errorMessage = "Google Sign-in was cancelled.";
                break;
            case 'auth/account-exists-with-different-credential':
                errorMessage = "Account exists with another sign-in method.";
                break;
            default:
                errorMessage = isGoogle ? "Google Sign-in failed. Try again." : "Login failed. Please try again.";
                console.error("Firebase Auth Error:", error.message);
                break;
        }

        showStatusPopup(errorMessage, false);
    }

    // 🔹 Auto-redirect if already logged in
    auth.onAuthStateChanged(user => {
        if (user && window.location.pathname.includes('login.html')) {
            const userName = user.displayName || user.email.split('@')[0];
            showStatusPopup(`✅ Welcome back, ${userName}! Redirecting...`, true);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1200);
        }
    });

    // 🔹 Email/Password Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                showStatusPopup("Please enter both email and password.", false);
                return;
            }

            showStatusPopup("Logging in...", true);

            try {
                await auth.signInWithEmailAndPassword(email, password);
                // onAuthStateChanged will redirect automatically
                showStatusPopup("✅ Login successful! Redirecting...", true);
            } catch (error) {
                handleAuthError(error, false);
            }
        });
    }

    // 🔹 Google Login
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            showStatusPopup("Signing in with Google...", true);

            try {
                await auth.signInWithPopup(provider);
                showStatusPopup("✅ Google Sign-in successful! Redirecting...", true);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1200);
            } catch (error) {
                handleAuthError(error, true);
            }
        });
    }

    // 🔹 Forgot Password
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (!email) {
                showStatusPopup("Please enter your email address to receive a reset link.", false);
                return;
            }

            showStatusPopup(`Sending reset link to ${email}...`, true);

            try {
                await auth.sendPasswordResetEmail(email);
                showStatusPopup(`📧 Reset link sent to ${email}. Check your inbox!`, true, 5000);
            } catch (error) {
                handleAuthError(error, false);
            }
        });
    }
});
