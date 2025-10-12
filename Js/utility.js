// Js/utility.js - Popup Message and General Utility Functions (Corrected Version)

/**
 * Displays a temporary status popup message on the screen.
 * This relies on 'status-popup' and 'popup-message' elements and corresponding CSS classes (show, success, error).
 * * @param {string} message - The text content to display.
 * @param {boolean} isSuccess - True for success (green), false for error (red).
 * @param {number} duration - Duration in milliseconds before hiding.
 */
function showStatusPopup(message, isSuccess = true, duration = 3000) {
    const popup = document.getElementById('status-popup');
    const messageElement = document.getElementById('popup-message');

    if (!popup || !messageElement) {
        console.warn("Status popup elements not found (missing #status-popup or #popup-message). Skipping display.");
        return;
    }

    messageElement.textContent = message;
    
    // Reset all status/visibility classes
    popup.classList.remove('success', 'error', 'show');

    // Add appropriate status class
    if (isSuccess) {
        popup.classList.add('success');
    } else {
        popup.classList.add('error');
    }
    
    // Show the popup (using the 'show' CSS class)
    popup.classList.add('show'); 

    // Hide after the specified duration
    setTimeout(() => {
        popup.classList.remove('show');
    }, duration);
}

// Global exposure is essential so all other scripts can call showStatusPopup directly.
window.showStatusPopup = showStatusPopup;