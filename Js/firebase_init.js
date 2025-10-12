// File: Js/firebase_init.js
// Centralized Firebase Configuration and Initialization

const firebaseConfig = {
    // Your verified config (copied from your console)
    apiKey: "AIzaSyC4rfGDs8BqZy6YAcXu7ccvTEMvudL8w4g", 
    authDomain: "kisan-saathiii.firebaseapp.com",
    projectId: "kisan-saathiii", 
    storageBucket: "kisan-saathiii.appspot.com", 
    messagingSenderId: "1069746635685", 
    appId: "1:1069746635685:web:b6cade8247e56094011e4c",
    measurementId: "G-XJ0T10GRND"
};

// Initialize Firebase and services globally
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore(); 
const storage = app.storage(); 

// Global logout function for simplicity
window.handleLogout = async function() {
    try {
        await auth.signOut();
        // Use showStatusPopup() if the utility script is loaded
        if (typeof showStatusPopup === 'function') {
            showStatusPopup("Logged out successfully!");
        } else {
            alert("Logged out successfully!");
        }
        // Redirect to homepage after logout
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    } catch (error) {
        console.error("Logout Error:", error);
        // Use showStatusPopup() if the utility script is loaded
        if (typeof showStatusPopup === 'function') {
            showStatusPopup("Logout failed. Check console.");
        }
    }
};