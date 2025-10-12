// File: Js/profile_upload.js

document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('profile-image-upload');
    const previewImg = document.getElementById('profile-preview');
    const removeBtn = document.getElementById('remove-img-btn');
    // Set your default avatar path here
    const defaultImgSrc = 'images/default_avatar.png'; 

    // Initialize with default image
    if (previewImg) {
        previewImg.src = defaultImgSrc;
    }

    // 1. Handle File Selection and Preview
    if (uploadInput && previewImg && removeBtn) {
        uploadInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    removeBtn.style.display = 'inline-block'; // Show remove button
                };
                reader.readAsDataURL(this.files[0]);
            }
        });

        // 2. Handle Image Removal
        removeBtn.addEventListener('click', function() {
            previewImg.src = defaultImgSrc;
            uploadInput.value = ''; // Clear the input file
            removeBtn.style.display = 'none'; // Hide remove button
        });
    }
});