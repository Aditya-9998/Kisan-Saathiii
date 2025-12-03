document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const emailEl = document.getElementById("email-value");
  const farmerIdEl = document.getElementById("farmer-id");

  const nameEl = document.getElementById("displayName");
  const phoneEl = document.getElementById("phone");
  const pinEl = document.getElementById("pincode");
  const stateEl = document.getElementById("state");

  const saveBtn = document.getElementById("saveBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const delBtn = document.getElementById("deleteAccountBtn");

  let currentUser = null;

  function popup(msg) {
    const box = document.getElementById("popup");
    box.innerText = msg;
    box.style.display = "block";
    setTimeout(() => (box.style.display = "none"), 2000);
  }

  auth.onAuthStateChanged(async (u) => {
    if (!u) return (location.href = "login.html");

    currentUser = u;
    emailEl.textContent = u.email;

    const snap = await db.collection("users").doc(u.uid).get();
    const data = snap.data();

    farmerIdEl.textContent = data.farmerId;
    nameEl.value = data.name || "";
    phoneEl.value = data.phone || "";
    pinEl.value = data.pincode || "";
    stateEl.value = data.state || "";

    // QR GENERATE
    const qr = new QRious({
      element: document.getElementById("qr-code"),
      size: 200,
      value: `Farmer ID: ${data.farmerId}\nName: ${data.name}`
    });
  });

  saveBtn.onclick = async () => {
    await db.collection("users").doc(currentUser.uid).set(
      {
        name: nameEl.value,
        phone: phoneEl.value,
        pincode: pinEl.value,
        state: stateEl.value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );
    popup("Profile updated!");
  };

  logoutBtn.onclick = async () => {
    await auth.signOut();
    location.href = "index.html";
  };

  delBtn.onclick = async () => {
    if (!confirm("Delete account permanently?")) return;

    await db.collection("users").doc(currentUser.uid).delete();
    await currentUser.delete();

    popup("Account deleted!");
    setTimeout(() => (location.href = "index.html"), 1200);
  };
});
