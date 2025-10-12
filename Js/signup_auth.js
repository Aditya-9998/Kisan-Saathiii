// Js/signup_auth.js

document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase services are available
    if (typeof window.firebaseAuth === 'undefined' || typeof window.firebaseDb === 'undefined' || typeof window.firebaseStorage === 'undefined') {
        console.error("One or more Firebase services (Auth, DB, Storage) are not initialized.");
        return;
    }

    const signupForm = document.getElementById('signup-form');
    const authMessage = document.getElementById('auth-message');
    
    // Form Inputs
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const phoneInput = document.getElementById('phone');
    const stateInput = document.getElementById('state');
    const pincodeInput = document.getElementById('pincode');
    const locationSelect = document.getElementById('location');
    const profileImageUpload = document.getElementById('profile-image-upload');

    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    const storage = window.firebaseStorage;

    // Helper function to display messages
    function showMessage(message, isError = false) {
        authMessage.textContent = message;
        authMessage.style.color = isError ? 'red' : 'green';
        authMessage.style.display = 'block';
    }

    // --- Core Signup Handler ---
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showMessage('Creating account...', false);

            const name = nameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            const imageFile = profileImageUpload.files[0];

            try {
                // 1. Create User in Firebase Authentication
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                let photoURL = '';

                // 2. Handle Profile Picture Upload (Optional)
                if (imageFile) {
                    showMessage('Uploading profile picture...', false);
                    const storageRef = storage.ref();
                    const profileImageRef = storageRef.child(`users/${user.uid}/profile.jpg`);
                    await profileImageRef.put(imageFile);
                    photoURL = await profileImageRef.getDownloadURL();
                }

                // 3. Update Auth Profile (Display Name & Photo URL)
                await user.updateProfile({
                    displayName: name,
                    photoURL: photoURL
                });

                // 4. Save Additional User Data to Firestore
                showMessage('Saving user details...', false);
                await db.collection('farmers').doc(user.uid).set({
                    name: name,
                    email: email,
                    phone: phoneInput.value,
                    state: stateInput.value,
                    pincode: pincodeInput.value,
                    country: locationSelect.value,
                    profilePhotoURL: photoURL,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                // 5. Success and Redirect
                showMessage('Registration Successful! Redirecting to Home.', false);
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redirect to home/dashboard
                }, 1500);

            } catch (error) {
                // Handle Errors
                let errorMessage = 'Registration failed.';
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email is already in use.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'The email address is not valid.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password should be at least 6 characters.';
                        break;
                    default:
                        errorMessage = `Error: ${error.message}`;
                        break;
                }
                showMessage(errorMessage, true);
                console.error("Signup Error:", error);
                
                // If account creation fails, we might want to clean up if the user was partially created,
                // but for basic setup, we rely on the error handling here.
            }
        });
    }

    // NOTE: Profile picture preview logic should be in Js/profile.js (as per your script list).
    // Ensure profile.js has listeners for 'profile-image-upload' and 'remove-img-btn'
});