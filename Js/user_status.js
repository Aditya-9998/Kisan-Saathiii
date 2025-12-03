// user_status.js (FINAL - V8 Compatible, Login + Logout Popup Fixed)

(function () {
  console.log("user_status.js loaded...");

  document.addEventListener("navbarLoaded", initUserStatus);

  function toast(msg, icon = "success") {
    setTimeout(() => {
      if (window.Swal) {
        Swal.fire({
          toast: true,
          icon,
          position: "top-end",
          title: msg,
          timer: 2200,
          showConfirmButton: false,
        });
      } else alert(msg);
    }, 250);
  }

  function initUserStatus() {
    console.log("initUserStatus running...");

    // Firebase ready?
    if (!window.firebaseAuth || !window.firebaseDb) {
      console.warn("Firebase not loaded on this page. Skipping user_status.js");
      return;
    }


    const auth = window.firebaseAuth;
    const db = window.firebaseDb;

    const loginBtn = document.getElementById("login-btn");
    const userNameEl = document.getElementById("user-name");

    if (!loginBtn || !userNameEl) {
      console.warn("Navbar elements not ready, retrying...");
      return setTimeout(initUserStatus, 300);
    }

    // MAIN AUTH LISTENER
    auth.onAuthStateChanged(async (user) => {
      /* ===============================
         WHEN USER LOGS OUT  (user = null)
      ================================== */
      if (!user) {

        // Show logout popup after redirect
        if (sessionStorage.getItem("logoutSuccess")) {
          setTimeout(() => {
            toast("Logged out successfully!", "success");
            sessionStorage.removeItem("logoutSuccess");
          }, 400);
        }

        loginBtn.style.display = "inline-block";
        userNameEl.style.display = "none";
        return;
      }

      /* ===============================
         WHEN USER IS LOGGED IN
      ================================== */
      let name = user.displayName || user.email.split("@")[0];

      // Try Firestore name override
      try {
        const snap = await db.collection("users").doc(user.uid).get();
        if (snap.exists && snap.data().name) {
          name = snap.data().name;
        }
      } catch (e) {
        console.warn("Firestore read failed", e);
      }

      // Update UI
      loginBtn.style.display = "none";
      userNameEl.style.display = "inline-block";
      userNameEl.textContent = "Hey " + name;

      // Login popup
      if (sessionStorage.getItem("loginSuccess")) {
        toast("Welcome " + name, "success");
        sessionStorage.removeItem("loginSuccess");
      }
    });
  }
})();
