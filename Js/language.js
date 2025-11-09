// ✅ Js/language.js
import { fetchFromGoogleTranslate } from "./translate.js";
import { translations } from "./translations.js";

let currentLang = "en";

// 🔹 Translate all elements using dictionary + fallback to Google Translate
async function translatePage(targetLang) {
  currentLang = targetLang;
  console.log(`🌐 Translating page to: ${targetLang}`);

  const allElements = document.querySelectorAll("[data-lang-key]");
  for (const el of allElements) {
    const keyPath = el.getAttribute("data-lang-key");
    const originalText = el.getAttribute("data-original") || el.innerText.trim();
    let translatedText = "";

    // ✅ Support nested translation keys like navbar.home, hero.title
    const parts = keyPath.split(".");
    let value = translations[targetLang];
    for (const p of parts) {
      if (value && typeof value === "object") {
        value = value[p];
      } else {
        value = null;
        break;
      }
    }

    if (value) {
      translatedText = value; // Use manual translation
    } else {
      // Fallback: Use Google Translate for new text
      try {
        translatedText = await fetchFromGoogleTranslate(originalText, targetLang);
      } catch (err) {
        console.warn("⚠️ Auto-translate failed for:", originalText);
        translatedText = originalText;
      }
    }

    // ✅ Apply translation
    if (translatedText && translatedText !== el.innerText.trim()) {
      el.setAttribute("data-original", originalText);
      el.innerText = translatedText;
    }
  }
}

// 🔹 Listen for newly added elements (like dynamic sections)
function setupAutoDetection() {
  const observer = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          node.querySelectorAll("[data-lang-key]").forEach(async (child) => {
            const key = child.getAttribute("data-lang-key");
            if (key) {
              const parts = key.split(".");
              let value = translations[currentLang];
              for (const p of parts) {
                if (value && typeof value === "object") value = value[p];
                else {
                  value = null;
                  break;
                }
              }

              if (value) child.innerText = value;
              else
                child.innerText = await fetchFromGoogleTranslate(
                  child.innerText.trim(),
                  currentLang
                );
            }
          });
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// 🔹 Global function (used by navbar buttons)
window.changeLanguage = async function (lang) {
  if (!lang || lang === currentLang) return;
  localStorage.setItem("language", lang);
  await translatePage(lang);
};

// 🔹 Initialization
document.addEventListener("DOMContentLoaded", async () => {
  const savedLang = localStorage.getItem("language") || "en";
  currentLang = savedLang;
  await translatePage(savedLang);
  setupAutoDetection();

  // Attach to navbar buttons
  const buttons = document.querySelectorAll(".lang-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const lang = btn.getAttribute("data-lang") || btn.id.replace("lang-", "");
      await window.changeLanguage(lang);
    });
  });
});
