// Js/login_auth.js (COMPAT - supports Farmer ID login and Google sign-in account creation)
// Place alongside your other Js files and include it in login.html (like you currently do for other scripts).

document.addEventListener("DOMContentLoaded", () => {
  // firebase should be already initialized by firebase_init.js (compat)
  const auth = firebase.auth();
  const db = firebase.firestore();

  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const googleLoginBtn = document.getElementById("google-login-btn");
  const forgotPasswordLink = document.getElementById("forgot-password-link");

  function showStatus(msg, isSuccess = true) {
    // try to use your site's showStatusPopup or fallback to alert
    if (window.showStatusPopup) return window.showStatusPopup(msg, isSuccess);
    alert(msg);
  }

  // helper: generate farmer id (ensure collisions low)
  function generateFarmerId() {
    const num = Math.floor(100000 + Math.random() * 900000);
    return `FS-AGRI-${num}`;
  }

  // helper: ensure unique farmerId (if already exists, regenerate a few times)
  async function generateUniqueFarmerId() {
    for (let i = 0; i < 6; i++) {
      const id = generateFarmerId();
      const q = await db.collection("users").where("farmerId", "==", id).limit(1).get();
      if (q.empty) return id;
    }
    // fallback
    return `${generateFarmerId()}-${Date.now().toString().slice(-4)}`;
  }

  // helper: find email by farmerId
  async function farmerIdToEmail(farmerId) {
    const snap = await db.collection("users").where("farmerId", "==", farmerId).limit(1).get();
    if (!snap.empty) {
      const doc = snap.docs[0].data();
      return doc.email || null;
    }
    return null;
  }

  // when user is already logged in on login page -> redirect
  auth.onAuthStateChanged((user) => {
    if (user && /login\.html$/i.test(location.pathname)) {
      sessionStorage.setItem("loginSuccess", "true");
      setTimeout(() => (location.href = "index.html"), 600);
    }
  });

  // Form login (supports Farmer ID)
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let identifier = (emailInput.value || "").trim();
      const password = (passwordInput.value || "").trim();

      if (!identifier || !password) {
        showStatus("Enter email/farmer ID and password.", false);
        return;
      }

      // If user typed Farmer ID (no '@'), convert to email via Firestore
      if (!identifier.includes("@")) {
        try {
          const foundEmail = await farmerIdToEmail(identifier);
          if (!foundEmail) {
            showStatus("Invalid Farmer ID.", false);
            return;
          }
          identifier = foundEmail;
        } catch (err) {
          console.error("Farmer lookup failed", err);
          showStatus("Server error during farmer-id lookup.", false);
          return;
        }
      }

      // Try sign-in
      try {
        await auth.signInWithEmailAndPassword(identifier, password);
        sessionStorage.setItem("loginSuccess", "true");
        showStatus("Login successful.", true);
        setTimeout(() => (location.href = "index.html"), 700);
      } catch (err) {
        console.error("Login error:", err);
        // map common codes
        if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
          showStatus("Incorrect email/ID or password.", false);
        } else if (err.code === "auth/invalid-email") {
          showStatus("Invalid email format.", false);
        } else {
          showStatus("Login failed. Check credentials.", false);
        }
      }
    });
  }

  // Google sign-in
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        if (!user) throw new Error("No user returned.");

        // Ensure firestore user exists and has farmerId, if not create one.
        const userDocRef = db.collection("users").doc(user.uid);
        const existing = await userDocRef.get();

        if (!existing.exists) {
          // generate unique farmerId
          const farmerId = await generateUniqueFarmerId();

          // generate a random password and save to Firestore (ONLY FOR USER REFERENCE)
          // Important: The actual Auth account password is blank (Google provider). We'll attempt to set a password on the Auth user (works because user just signed-in).
          const autoPassword = Math.random().toString(36).slice(-8);

          const docData = {
            uid: user.uid,
            email: user.email || "",
            name: user.displayName || "",
            phone: user.phoneNumber || "",
            pincode: "",
            state: "",
            farmerId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            // store password ONLY IF you want to show it to user — it's sensitive. You can also omit storing it.
            // We store it so the user can use farmerId+password later (we also attempt to set auth password).
            password: autoPassword
          };

          await userDocRef.set(docData);

          // Try to set the auth password so that user can login also with email+password
          // This can succeed because user just signed-in via Google (recent login).
          try {
            await user.updatePassword(autoPassword); // sets password on auth user
            // notify user
            showStatus(`Google account linked. Farmer ID: ${farmerId}. Password set. Save it.`, true);
            // Provide a non-blocking alert with credentials (you can replace with nicer UI)
            setTimeout(() => {
              alert(`Welcome!\nYour Farmer ID: ${farmerId}\nPassword (save it): ${autoPassword}\nYou can login using Farmer ID or Google.`);
            }, 200);
          } catch (pwErr) {
            // If updatePassword fails (rare), still user can use Google sign-in; show credentials and ask user to set password with reset link.
            console.warn("updatePassword failed:", pwErr);
            alert(`Welcome!\nYour Farmer ID: ${farmerId}\nPassword: ${autoPassword}\nNOTE: we couldn't set the auth password automatically. Please use 'Forgot Password' to set one if needed.`);
          }
        } else {
          // Document exists — ensure farmerId is present
          const data = existing.data();
          if (!data.farmerId) {
            const farmerId = await generateUniqueFarmerId();
            await userDocRef.set({ farmerId }, { merge: true });
            alert(`Your Farmer ID: ${farmerId}`);
          }
        }

        // redirect after sign-in
        setTimeout(() => (location.href = "index.html"), 600);
      } catch (err) {
        console.error("Google sign-in failed:", err);
        showStatus("Google sign-in failed.", false);
      }
    });
  }

  // Forgot password link
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = (emailInput.value || "").trim();
      if (!email) return showStatus("Enter your email first.", false);
      try {
        await auth.sendPasswordResetEmail(email);
        showStatus("Password reset email sent.", true);
      } catch (err) {
        console.error("Reset email failed", err);
        showStatus("Unable to send reset email.", false);
      }
    });
  }
});