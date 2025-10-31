// Js/profile.js
document.addEventListener('DOMContentLoaded', () => {
    const auth = window.firebaseAuth;
    const storage = window.firebaseStorage;
    const popup = window.showStatusPopup || console.log;

    if (!auth || !storage) {
        console.error("Firebase Auth or Storage not initialized.");
        return;
    }

    // Redirect if not logged in
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'login.html';
        } else {
            loadUserProfile(user);
        }
    });

    const userNameSpan = document.getElementById('profileUserName');
    const userEmailSpan = document.getElementById('profileUserEmail');
    const mainProfilePic = document.getElementById('mainProfilePic');
    const logoutBtn = document.getElementById('logoutProfileBtn');
    const addPicBtn = document.getElementById('addProfilePicBtn');
    const removePicBtn = document.getElementById('removeProfilePicBtn');
    const picInput = document.getElementById('profilePicInput');

    // Helper function for translations (from user_status.js)
    const getTranslatedText = (key, fallback) => {
        const t = window.currentTranslations || {};
        return key.split(".").reduce((acc, k) => (acc && acc[k] ? acc[k] : null), t) || fallback;
    };

    // 1. Load and Display User Data
    function loadUserProfile(user) {
        const name = user.displayName || user.email.split("@")[0];
        userNameSpan.textContent = name;
        userEmailSpan.textContent = user.email;

        // NOTE: Phone Number is usually stored in a database (like Firestore), 
        // not directly in Firebase Auth. We display a placeholder here.
        // If you store phone in 'displayName' or somewhere else, update this line:
        // document.getElementById('profileUserPhone').textContent = user.phoneNumber || 'N/A (Update in Edit Details)';
        
        mainProfilePic.src = user.photoURL || 'images/default-avatar.png';
    }

    // 2. Profile Picture Upload/Change
    addPicBtn.addEventListener('click', () => {
        picInput.click();
    });

    picInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const user = auth.currentUser;
        if (!user) {
            popup(getTranslatedText("error.notLoggedIn", "You must be logged in to upload."), false);
            return;
        }

        try {
            popup(getTranslatedText("profile.uploading", "Uploading profile picture..."), true);
            const storageRef = storage.ref();
            // Use user's UID to name the file
            const avatarRef = storageRef.child(`avatars/${user.uid}/profile.jpg`); 
            
            const snapshot = await avatarRef.put(file);
            const url = await snapshot.ref.getDownloadURL();

            // Update photoURL in Firebase Auth
            await user.updateProfile({ photoURL: url });

            // Update UI
            mainProfilePic.src = url;
            popup(getTranslatedText("profile.updateSuccess", "Profile picture updated successfully!"), true, 2500);
            
            // Reload user status in navbar if it's already loaded (optional)
            if (window.updateUserStatus) window.updateUserStatus(user);

        } catch (error) {
            console.error("Avatar Upload Error:", error);
            popup(getTranslatedText("profile.updateFailed", "Failed to update profile picture."), false);
        }
    });

    // 3. Profile Picture Removal
    removePicBtn.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) return;

        // Confirm removal
        const result = await Swal.fire({
            title: getTranslatedText("profile.confirmRemoveTitle", "Remove Picture?"),
            text: getTranslatedText("profile.confirmRemoveText", "Are you sure you want to remove your profile picture?"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: getTranslatedText("profile.yesRemove", "Yes, remove it!")
        });

        if (result.isConfirmed) {
            try {
                // Delete the file from Firebase Storage
                const storageRef = storage.ref();
                const avatarRef = storageRef.child(`avatars/${user.uid}/profile.jpg`);
                await avatarRef.delete().catch(err => {
                    // Ignore error if file doesn't exist
                    if (err.code !== 'storage/object-not-found') throw err;
                });

                // Set photoURL to null in Firebase Auth
                await user.updateProfile({ photoURL: null });

                // Update UI
                mainProfilePic.src = 'images/default-avatar.png';
                popup(getTranslatedText("profile.removeSuccess", "Profile picture removed."), true, 2500);

                // Reload user status in navbar (optional)
                if (window.updateUserStatus) window.updateUserStatus(user);

            } catch (error) {
                console.error("Avatar Removal Error:", error);
                popup(getTranslatedText("profile.removeFailed", "Failed to remove profile picture."), false);
            }
        }
    });

    // 4. Logout Functionality (using the one from user_status.js if possible, or re-implement)
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        popup(getTranslatedText("navbar.loggingOut", "Logging out..."), true, 800);

        auth.signOut()
            .then(() => {
                sessionStorage.setItem("logoutSuccess", "true");
                setTimeout(() => (window.location.href = "index.html"), 1000);
            })
            .catch((err) => {
                popup(getTranslatedText("navbar.logoutFailed", "Logout failed. Please try again."), false);
                console.error("Logout Error:", err);
            });
    });

});