// ✅ Js/translate.js
export async function fetchFromGoogleTranslate(text, targetLang) {
  try {
    const response = await fetch(
      `http://localhost:5000/translate?text=${encodeURIComponent(text)}&target=${targetLang}`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.translatedText || text;
  } catch (err) {
    console.error("❌ Translation fetch failed:", err.message);
    return text; // fallback to original
  }
}
