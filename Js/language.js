// language.js — Multi-language system for Kisan Saathii
// ----------------------------------------------------
// Works with: data/en.json, data/hi.json
// Depends on: navbar.js (for language toggle buttons)

let translations = {};
let currentLang = localStorage.getItem("language") || "en";

// 🔹 Fetch and apply the selected language
async function loadLanguage(lang) {
  try {
    // ✅ Correct path (matches your folder structure)
    const res = await fetch(`data/${lang}.json`);
    if (!res.ok) throw new Error(`Language file not found: ${lang}`);

    translations = await res.json();
    applyTranslations();

    // ✅ Store selected language
    localStorage.setItem("language", lang);
    currentLang = lang;

    // ✅ Sync navbar language buttons (IDs must match navbar.js)
    const enBtn = document.getElementById("lang-en");
    const hiBtn = document.getElementById("lang-hi");
    if (enBtn && hiBtn) {
      enBtn.classList.toggle("active", lang === "en");
      hiBtn.classList.toggle("active", lang === "hi");
    }

  } catch (err) {
    console.error("Language load error:", err);
  }
}

// 🔹 Apply all translations to elements with data-lang-key
function applyTranslations() {
  document.querySelectorAll("[data-lang-key]").forEach((el) => {
    const key = el.getAttribute("data-lang-key");
    const text = getTranslation(key);
    if (text !== undefined && text !== null) {
      // Use textContent for safe text replacement
      el.textContent = text;
    }
  });
}

// 🔹 Recursive key parser (e.g., "navbar.home" → translations.navbar.home)
function getTranslation(key) {
  return key.split(".").reduce((obj, i) => (obj ? obj[i] : null), translations);
}

// 🔹 Expose changeLanguage globally (used by navbar.js)
window.changeLanguage = function (lang) {
  if (lang === currentLang) return;
  loadLanguage(lang);
};

// 🔹 Initial load on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  loadLanguage(currentLang);
});
