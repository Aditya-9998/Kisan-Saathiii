const GOOGLE_TRANSLATE_API_KEY = "AIzaSyDp3T6OdJMHsHmv32I_ePWuV45bceEfBHc";

export async function fetchFromGoogleTranslate(text, targetLang = "hi") {
  if (!text || text.trim() === "") return text;

  const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      target: targetLang,
      format: "text",
    }),
  });

  const data = await res.json();

  if (data.error) {
    console.error("Google Translate API error:", data.error.message);
    return text;
  }

  return data.data?.translations?.[0]?.translatedText || text;
}
