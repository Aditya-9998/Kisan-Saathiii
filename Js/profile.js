// Js/profile.js — module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4rfGDs8BqZy6YAcXu7ccvTEMvudL8w4g",
  authDomain: "kisan-saathiii.firebaseapp.com",
  projectId: "kisan-saathiii",
  storageBucket: "kisan-saathiii.appspot.com",
  messagingSenderId: "1069746635685",
  appId: "1:1069746635685:web:b6cade8247e56094011e4c",
  measurementId: "G-XJ0T10GRND"
};

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (err) {
  console.warn("Firebase init (profile):", err?.message || err);
}
const auth = getAuth(app);
const db = getFirestore(app);

const el = id => document.getElementById(id);
const showToast = window.showStatusPopup || (() => {});

function clearForm() {
  if (el('displayName')) el('displayName').value = '';
  if (el('phone')) el('phone').value = '';
  if (el('pincode')) el('pincode').value = '';
  if (el('state')) el('state').value = '';
  if (el('profileImageURL')) el('profileImageURL').value = '';
  if (el('avatar-img')) el('avatar-img').src = 'images/default-avatar.png';
  if (el('email-value')) el('email-value').textContent = '—';
}

/* require elements exist before binding — guard for pages without profile UI */
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById('logoutBtnLocal')) {
    // not profile page — nothing to do
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // not logged-in -> go to login
      window.location.href = 'login.html';
      return;
    }
    const uid = user.uid;
    const usersRef = doc(db, 'users', uid);

    try {
      const snap = await getDoc(usersRef);
      if (snap.exists()) {
        const data = snap.data();
        if (el('displayName')) el('displayName').value = data.name || user.displayName || '';
        if (el('phone')) el('phone').value = data.phone || '';
        if (el('pincode')) el('pincode').value = data.pincode || '';
        if (el('state')) el('state').value = data.state || '';
        if (el('profileImageURL')) el('profileImageURL').value = data.profileImageUrl || '';
        if (el('email-value')) el('email-value').textContent = data.email || user.email || '';
        if (el('avatar-img')) el('avatar-img').src = data.profileImageUrl || user.photoURL || 'images/default-avatar.png';
      } else {
        await setDoc(usersRef, {
          email: user.email || '',
          name: user.displayName || '',
          createdAt: serverTimestamp()
        }, { merge: true });

        if (el('displayName')) el('displayName').value = user.displayName || '';
        if (el('email-value')) el('email-value').textContent = user.email || '';
      }
    } catch (err) {
      console.error('Profile load error', err);
      showToast('Failed to load profile data', false);
    }
  });

  // Save changes
  if (el('saveBtn')) {
    el('saveBtn').addEventListener('click', async () => {
      const user = auth.currentUser;
      if (!user) { window.location.href = 'login.html'; return; }
      const uid = user.uid;
      const ref = doc(db, 'users', uid);
      const payload = {
        name: el('displayName').value.trim(),
        phone: el('phone').value.trim(),
        pincode: el('pincode').value.trim(),
        state: el('state').value.trim(),
        profileImageUrl: el('profileImageURL').value.trim(),
        updatedAt: serverTimestamp()
      };
      try {
        await updateDoc(ref, payload);
        showToast('Profile updated successfully', true);
        if (payload.profileImageUrl && el('avatar-img')) el('avatar-img').src = payload.profileImageUrl;
      } catch (err) {
        console.error('Save error', err);
        showToast('Failed to save profile', false);
      }
    });
  }

  if (el('cancelBtn')) {
    el('cancelBtn').addEventListener('click', () => {
      location.reload();
    });
  }

  // Logout action on profile page
  el('logoutBtnLocal').addEventListener('click', async () => {
    try {
      await signOut(auth);
      // show toast immediately
      showToast('Logout successful', true);
      // set session flag so navbar on index shows "You have logged out" if needed
      sessionStorage.setItem('logoutSuccess', 'true');
      setTimeout(() => window.location.href = 'index.html', 700);
    } catch (err) {
      console.error('Logout error', err);
      showToast('Logout failed', false);
    }
  });

  // Delete account (careful)
  if (el('deleteAccountBtn')) {
    el('deleteAccountBtn').addEventListener('click', async () => {
      const proceed = confirm('Delete account permanently? This will remove your users/{uid} document and sign you out.');
      if (!proceed) return;
      const user = auth.currentUser;
      if (!user) { window.location.href = 'login.html'; return; }
      const uid = user.uid;
      try {
        await deleteDoc(doc(db, 'users', uid));
        await deleteUser(user);
        showToast('Account deleted', true);
        setTimeout(() => window.location.href = 'index.html', 900);
      } catch (err) {
        console.error('Delete error', err);
        alert('Unable to delete account (you may need to re-login then try). Error: ' + err.message);
      }
    });
  }
});
