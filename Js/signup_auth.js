// signup_auth.js (FINAL - Firebase v8)

document.addEventListener("DOMContentLoaded", () => {
  const auth = window.firebaseAuth;
  const db = window.firebaseDb;

  const form = document.getElementById("signup-form");
  const msg = (m, e = false) => {
    const box = document.getElementById("auth-message");
    box.style.color = e ? "red" : "green";
    box.textContent = m;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const state = document.getElementById("state").value;
    const pin = document.getElementById("pincode").value;

    if (!name || !email || !pass) return msg("Fill all required fields", true);

    try {
      const cred = await auth.createUserWithEmailAndPassword(email, pass);
      const user = cred.user;

      await user.updateProfile({ displayName: name });

      await db.collection("users").doc(user.uid).set({
        name,
        email,
        phone,
        state,
        pincode: pin,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      sessionStorage.setItem("loginSuccess", "true");

      msg("Registered! Redirecting...");
      setTimeout(() => (location.href = "login.html"), 1200);
    } catch (er) {
      msg(er.message, true);
    }
  });
});
