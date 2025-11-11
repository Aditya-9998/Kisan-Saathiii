export async function fetchFromGoogleTranslate(text, targetLang) {
  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://kisan-translate.onrender.com";

  try {
    const response = await fetch(
      `${baseURL}/translate?text=${encodeURIComponent(text)}&target=${targetLang}`
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.translatedText || text;
  } catch (err) {
    console.error("❌ Translation fetch failed:", err.message);
    return text; // fallback to original text
  }
}
