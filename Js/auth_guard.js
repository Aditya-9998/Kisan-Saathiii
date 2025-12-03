// ⭐ auth_guard.js – Redirects if user NOT logged in

document.addEventListener("DOMContentLoaded", () => {
  const checkAuth = setInterval(() => {
    
    if (!window.firebaseAuth) return; // Firebase not ready
      
    clearInterval(checkAuth);

    window.firebaseAuth.onAuthStateChanged(user => {
      if (!user) {
        // Redirect to login
        window.location.href = "login.html";
      }
    });
  }, 300);
});
