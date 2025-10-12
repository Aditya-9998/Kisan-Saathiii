// Js/login_auth.js - FINAL CORRECTED VERSION with User-Friendly Errors

document.addEventListener('DOMContentLoaded', () => {
    // Ensure Firebase Auth is available
    if (typeof window.firebaseAuth === 'undefined') {
        console.error("Firebase Auth is not initialized.");
        return;
    }

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const googleLoginBtn = document.getElementById('google-login-btn');
    
    // Auth-message div ko hum yahaan hide kar denge, kyunki ab hum 'showStatusPopup' use kar rahe hain.
    const messageDisplay = document.getElementById('auth-message');
    if (messageDisplay) {
        messageDisplay.style.display = 'none';
    }

    const auth = window.firebaseAuth;

    // Helper function for user-friendly error messages (from utility.js)
    const showStatusPopup = window.showStatusPopup; // Assuming this is defined in Js/utility.js

    // Function to handle error messages professionally
    function handleAuthError(error, isGoogle = false) {
        let errorMessage = 'Login failed. Please try again.';

        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-login-credentials':
                errorMessage = 'Credentials don\'t match. Check your email and password.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'The email address format is invalid. Please correct it.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Access temporarily blocked due to too many failed attempts. Try again later.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            case 'auth/popup-closed-by-user':
                errorMessage = 'Sign-in cancelled. You closed the Google sign-in window.';
                break;
            case 'auth/account-exists-with-different-credential':
                errorMessage = 'This email is already registered with a different method (e.g., email/password).';
                break;
            default:
                errorMessage = isGoogle ? 'Google Sign-in failed. Try again.' : 'Login failed. Please try again.';
                console.error("Firebase Auth Error:", error.message);
                break;
        }
        showStatusPopup(errorMessage, false);
    }


    // 1. Check if user is already logged in (This logic remains the same)
    auth.onAuthStateChanged(user => {
        if (user && window.location.pathname.includes('login.html')) {
            // User is already signed in, redirect them to the home page
            showStatusPopup(`Welcome back, ${user.displayName || user.email.split('@')[0]}! Redirecting...`, true);
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1000);
        }
    });


    // 2. Email/Password Login Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;
            showStatusPopup('Logging in...', true);

            try {
                await auth.signInWithEmailAndPassword(email, password);
                
                // Login successful, onAuthStateChanged will handle the redirect
                // No need to show success message here, as redirect is imminent.

            } catch (error) {
                handleAuthError(error, false);
            }
        });
    }

    // 3. Google Sign-In Handler
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            showStatusPopup('Signing in with Google...', true);
            
            try {
                await auth.signInWithPopup(provider);

                // Sign-in successful, onAuthStateChanged will handle the redirect

            } catch (error) {
                handleAuthError(error, true);
            }
        });
    }

    // 4. Forgot Password Handler (If you add this link to login.html)
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = emailInput.value;

            if (!email) {
                showStatusPopup("Please enter your email address above to receive the reset link.", false);
                return;
            }

            showStatusPopup(`Sending password reset link to ${email}...`, true);

            try {
                await auth.sendPasswordResetEmail(email);
                showStatusPopup(`Password reset link sent successfully to ${email}. Check your inbox!`, true, 5000); // 5s duration

            } catch (error) {
                handleAuthError(error, false);
            }
        });
    }
});