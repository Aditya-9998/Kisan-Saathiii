
// ============================================================================
// Js/utility.js — FINAL IMPROVED VERSION
// ============================================================================
let popupTimeout;

function showStatusPopup(message, isSuccess = true, duration = 3000) {
  const popup = document.getElementById("status-popup");
  const msg = document.getElementById("popup-message");
  if (!popup || !msg) return;

  msg.textContent = message;
  popup.classList.remove("show", "success", "error");
  popup.classList.add(isSuccess ? "success" : "error", "show");

  // Clear previous timer to prevent flicker if triggered repeatedly
  if (popupTimeout) clearTimeout(popupTimeout);

  popupTimeout = setTimeout(() => {
    popup.classList.remove("show");
  }, duration);
}

window.showStatusPopup = showStatusPopup;
