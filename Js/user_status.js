// Js/user_status.js - FINAL CORRECTED VERSION

// Check if Firebase is available globally
if (typeof window.firebaseAuth === 'undefined' || !window.firebaseAuth) {
    console.warn("Firebase Auth is not globally available. Check script order in HTML.");
} else {
    // Auth object ready hai. DOMContentLoaded ka intezaar karein.
    document.addEventListener('DOMContentLoaded', () => {
        const auth = window.firebaseAuth;

        // Ek chhota sa delay (0ms) denge taaki language.js apna saara translation finish kar le.
        setTimeout(() => {
            
            const authLink = document.getElementById('auth-link');
            if (!authLink) {
                console.warn("Auth link element (id='auth-link') not found after navbar loaded.");
                return;
            }

            // --- Translation Helper Function ---
            // Hum language.js ke global variable 'window.currentTranslations' ka use karenge
            function getTranslatedText(key, defaultText) {
                const translations = window.currentTranslations || {};
                const keys = key.split('.');
                let res = translations;

                for (const k of keys) {
                    if (res && typeof res === "object" && Object.prototype.hasOwnProperty.call(res, k)) {
                        res = res[k];
                    } else {
                        return defaultText;
                    }
                }
                return typeof res === 'string' ? res : defaultText;
            }
            // ------------------------------------

            // Logout function (Step 1 fix for popup)
            const handleLogout = (e) => {
                e.preventDefault();
                // Assuming showStatusPopup is globally available (from utility.js)
                const popup = window.showStatusPopup || console.log; 
                
                popup("Logging out...", true, 1000); // Popup dikhao

                auth.signOut().then(() => {
                    // Logout successful, pop-up dikhane ke baad redirect karein
                    setTimeout(() => {
                        window.location.href = 'index.html'; 
                    }, 1500); 

                }).catch((error) => {
                    popup("Logout failed. Please try again.", false); // Logout error dikhao
                    console.error("Logout Error:", error);
                });
            };

            // Firebase Auth State Listener: Jo har login/logout par chalta hai
            auth.onAuthStateChanged((user) => {
                // Fetch translated strings every time the state changes
                const translatedWelcome = getTranslatedText('navbar.welcomePrefix', 'Welcome');
                const translatedLogout = getTranslatedText('navbar.logoutSuffix', 'Logout');
                
                if (user) {
                    // User is signed in (Logged In)
                    
                    const userName = user.displayName || user.email.split('@')[0];
                    
                    // Profile Photo
                    const profileIcon = user.photoURL 
                                        ? `<img src="${user.photoURL}" alt="Profile" style="height: 24px; width: 24px; border-radius: 50%; margin-right: 5px; vertical-align: middle;">` 
                                        : '<i class="fas fa-user-circle"></i>';

                    // 1. Update the link content using translated texts
                    authLink.innerHTML = `${profileIcon} ${translatedWelcome}, ${userName} (${translatedLogout})`;
                    
                    // 2. Link Action: Logout
                    authLink.href = '#'; 
                    
                    authLink.removeEventListener('click', handleLogout); 
                    authLink.addEventListener('click', handleLogout);

                    // 3. Prevent Translation Override: 
                    authLink.removeAttribute('data-lang-key');
                    
                } else {
                    // User is signed out (Not Logged In)
                    
                    // 1. Reset Link Text (language.js will handle this via data-lang-key)
                    authLink.setAttribute('data-lang-key', 'navbar.loginSignup'); 
                    
                    // 2. Link Action: Login page par redirect
                    authLink.href = 'login.html';
                    
                    authLink.removeEventListener('click', handleLogout);

                    // 3. Language ko refresh karein
                    document.dispatchEvent(new CustomEvent('translationsLoaded')); 
                }
            });

        }, 0); 
    });
}