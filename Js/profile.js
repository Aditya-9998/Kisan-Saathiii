// Js/profile.js (COMPAT) - updated to be tolerant and display QR with QRious (canvas)
document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  // DOM refs
  const emailEl = document.getElementById("email-value");
  const farmerIdEl = document.getElementById("farmer-id");
  const qrCanvas = document.getElementById("qr-code");

  const nameEl = document.getElementById("displayName");
  const phoneEl = document.getElementById("phone");
  const pinEl = document.getElementById("pincode");
  const stateEl = document.getElementById("state");

  const saveBtn = document.getElementById("saveBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const delBtn = document.getElementById("deleteAccountBtn");

  const popupBox = document.getElementById("popup");

  function popup(msg, ok = true) {
    if (!popupBox) return alert(msg);
    popupBox.textContent = msg;
    popupBox.style.background = ok ? "#2ecc71" : "#e74c3c";
    popupBox.style.display = "block";
    setTimeout(() => (popupBox.style.display = "none"), 2200);
  }

  let currentUser = null;
  let currentDoc = null;

  auth.onAuthStateChanged(async (u) => {
    if (!u) {
      // not logged in
      return (location.href = "login.html");
    }
    currentUser = u;
    emailEl.textContent = u.email || "—";

    try {
      const docRef = db.collection("users").doc(u.uid);
      const snap = await docRef.get();
      if (!snap.exists) {
        // If Google user signed up via Google but doc not created — create one with minimal fields
        const farmerId = `FS-AGRI-${Math.floor(100000 + Math.random() * 900000)}`;
        const newData = {
          uid: u.uid,
          email: u.email || "",
          name: u.displayName || "",
          farmerId,
          phone: u.phoneNumber || "",
          pincode: "",
          state: "",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        await docRef.set(newData);
        currentDoc = newData;
      } else {
        currentDoc = snap.data();
      }

      // Populate UI
      farmerIdEl.textContent = currentDoc.farmerId || "—";
      nameEl.value = currentDoc.name || u.displayName || "";
      phoneEl.value = currentDoc.phone || currentDoc.phoneNumber || "";
      pinEl.value = currentDoc.pincode || "";
      stateEl.value = currentDoc.state || "";

      // Generate QR via QRious (canvas)
      try {
        if (typeof QRious !== "undefined" && qrCanvas) {
          const qrValue = `Farmer ID: ${currentDoc.farmerId || "-"}\nName: ${currentDoc.name || "-" }\nEmail: ${currentDoc.email || "-"}`;
          // make QR a bit smaller if container small
          new QRious({
            element: qrCanvas,
            value: qrValue,
            size: 200,
            level: "H"
          });
        } else {
          console.warn("QRious or qr canvas missing");
        }
      } catch (qrErr) {
        console.error("QR error", qrErr);
      }
    } catch (err) {
      console.error("Profile load error", err);
      popup("Cannot load profile.", false);
    }
  });

  // Save updates
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      if (!currentUser) return popup("Not authenticated", false);
      try {
        await db.collection("users").doc(currentUser.uid).set({
          name: nameEl.value,
          phone: phoneEl.value,
          pincode: pinEl.value,
          state: stateEl.value,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // update displayName in auth profile too
        await currentUser.updateProfile({ displayName: nameEl.value });

        popup("Profile updated", true);
      } catch (err) {
        console.error("Save error", err);
        popup("Save failed", false);
      }
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await auth.signOut();
        sessionStorage.setItem("logoutSuccess", "true");
        location.href = "index.html";
      } catch (err) {
        console.error("Logout failed", err);
        popup("Logout failed", false);
      }
    });
  }

  // Delete
  if (delBtn) {
    delBtn.addEventListener("click", async () => {
      if (!confirm("Delete account permanently?")) return;
      try {
        // delete firestore doc first
        await db.collection("users").doc(currentUser.uid).delete();
        // delete auth user
        await currentUser.delete();
        popup("Account deleted", true);
        setTimeout(() => (location.href = "index.html"), 1000);
      } catch (err) {
        console.error("Delete failed", err);
        popup("Delete failed (maybe re-login required)", false);
      }
    });
  }
});
