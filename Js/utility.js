// Js/utility.js — plain script
(function () {
  // If SweetAlert2 available, use it. Else fallback.
  window.showStatusPopup = function (message = "", success = true, timeout = 3000) {
    if (window.Swal && typeof window.Swal.fire === "function") {
      // small styled toast
      window.Swal.fire({
        toast: true,
        position: "top-end",
        icon: success ? "success" : "error",
        title: message,
        showConfirmButton: false,
        timer: timeout,
        background: success ? "#e8ffe8" : undefined,
      });
      return;
    }

    // Fallback toast
    let container = document.getElementById("__fallback_toast_container");
    if (!container) {
      container = document.createElement("div");
      container.id = "__fallback_toast_container";
      container.style.position = "fixed";
      container.style.top = "20px";
      container.style.right = "20px";
      container.style.zIndex = 99999;
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.marginTop = "6px";
    toast.style.padding = "10px 14px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 3px 8px rgba(0,0,0,0.12)";
    toast.style.background = success ? "#dff2df" : "#ffdede";
    toast.style.color = "#222";
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 300ms";
      setTimeout(() => toast.remove(), 350);
    }, timeout);
  };
})();
