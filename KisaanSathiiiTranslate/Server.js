// ✅ server.js (Final Render-Ready Version)
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "@google-cloud/translate";

const { v2 } = pkg;
const { Translate } = v2;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Initialize Google Translate API
const translate = new Translate({
  keyFilename: "./service-account.json",
});

// ✅ Translation Endpoint
app.get("/translate", async (req, res) => {
  try {
    const { text, target } = req.query;
    if (!text || !target) {
      return res.status(400).json({ error: "Missing 'text' or 'target' parameter" });
    }

    const [translation] = await translate.translate(text, target);
    res.json({ translatedText: translation });
  } catch (err) {
    console.error("❌ Translation Error:", err);
    res.status(500).json({ error: "Translation failed", details: err.message });
  }
});

// ✅ Root route for quick testing
app.get("/", (req, res) => {
  res.send("🌾 Kisan Saathiii Translation API is Live!");
});

// ✅ Correct Port Binding for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
