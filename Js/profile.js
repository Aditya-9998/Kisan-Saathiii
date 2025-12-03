// profile.js (FINAL - Firebase v8)

document.addEventListener("DOMContentLoaded", () => {
  const auth = window.firebaseAuth;
  const db = window.firebaseDb;

  const nameEl = document.getElementById("displayName");
  const phoneEl = document.getElementById("phone");
  const pinEl = document.getElementById("pincode");
  const stateEl = document.getElementById("state");
  const emailEl = document.getElementById("email-value");

  const saveBtn = document.getElementById("saveBtn");
  const delBtn = document.getElementById("deleteAccountBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  let user = null;

  function toast(msg, icon = "success") {
    setTimeout(() => {
      if (window.Swal) {
        Swal.fire({
          toast: true,
          icon,
          position: "top-end",
          title: msg,
          timer: 2000,
          showConfirmButton: false,
        });
      } else alert(msg);
    }, 200);
  }

  auth.onAuthStateChanged(async (u) => {
    if (!u) return (location.href = "login.html");

    user = u;

    const snap = await db.collection("users").doc(user.uid).get();
    const data = snap.exists ? snap.data() : {};

    emailEl.textContent = user.email;
    nameEl.value = data.name || user.displayName || "";
    phoneEl.value = data.phone || "";
    pinEl.value = data.pincode || "";
    stateEl.value = data.state || "";
  });

  saveBtn.addEventListener("click", async () => {
    if (!user) return;

    await db.collection("users").doc(user.uid).set(
      {
        name: nameEl.value,
        phone: phoneEl.value,
        pincode: pinEl.value,
        state: stateEl.value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    user.updateProfile({ displayName: nameEl.value });

    toast("Profile updated!");
  });

  logoutBtn.addEventListener("click", async () => {
    sessionStorage.setItem("logoutSuccess", "true");
    await auth.signOut();
    location.href = "index.html";
  });

  delBtn.addEventListener("click", async () => {
    if (!confirm("Delete account permanently?")) return;

    await db.collection("users").doc(user.uid).delete();
    await user.delete();

    toast("Account deleted!");
    setTimeout(() => (location.href = "index.html"), 1000);
  });
});
