// Js/signup_auth.js (COMPAT) - replace your old signup_auth.js
document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const form = document.getElementById("signup-form");
  const msgBox = document.getElementById("auth-message");

  function showMsg(m, isError = false) {
    if (!msgBox) return alert(m);
    msgBox.style.color = isError ? "red" : "green";
    msgBox.textContent = m;
  }

  // generate farmer id
  function genRandom() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  async function generateUniqueFarmerId() {
    for (let i = 0; i < 6; i++) {
      const id = `FS-AGRI-${genRandom()}`;
      const q = await db.collection("users").where("farmerId", "==", id).limit(1).get();
      if (q.empty) return id;
    }
    return `FS-AGRI-${genRandom()}-${Date.now().toString().slice(-4)}`;
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = (document.getElementById("name").value || "").trim();
    const email = (document.getElementById("email").value || "").trim();
    const pass = document.getElementById("password").value || "";
    const phone = (document.getElementById("phone").value || "").trim();
    const state = (document.getElementById("state").value || "").trim();
    const pin = (document.getElementById("pincode").value || "").trim();

    if (!name || !email || !pass) return showMsg("Fill required fields", true);

    try {
      const cred = await auth.createUserWithEmailAndPassword(email, pass);
      const user = cred.user;
      await user.updateProfile({ displayName: name });

      const farmerId = await generateUniqueFarmerId();

      await db.collection("users").doc(user.uid).set({
        uid: user.uid,
        name,
        email,
        phone,
        state,
        pincode: pin,
        farmerId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      sessionStorage.setItem("loginSuccess", "true");
      showMsg("Registered! Redirecting...");
      setTimeout(() => (location.href = "login.html"), 1200);
    } catch (err) {
      console.error("Signup error", err);
      showMsg(err.message || "Signup failed", true);
    }
  });
});