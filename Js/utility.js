// ============================================================================
// Js/utility.js — STATUS POPUP HANDLER (Language handled by Js/language.js)
// ============================================================================

let popupTimeout;

// ============================
// ✅ Status Popup Function
// ============================
function showStatusPopup(message, isSuccess = true, duration = 3000) {
  const popup = document.getElementById("status-popup");
  const msg = document.getElementById("popup-message");
  if (!popup || !msg) return;

  msg.textContent = message;
  popup.classList.remove("show", "success", "error");
  popup.classList.add(isSuccess ? "success" : "error", "show");

  if (popupTimeout) clearTimeout(popupTimeout);
  popupTimeout = setTimeout(() => popup.classList.remove("show"), duration);
}

// Make available globally
window.showStatusPopup = showStatusPopup;

// ============================================================================
// NOTE:
// The multilingual logic previously here has been moved to `Js/language.js`.
// Do NOT duplicate `changeLanguage()` or `loadLanguage()` in this file.
// ============================================================================
