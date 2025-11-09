// ✅ server.js (Final Fixed)
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

app.get("/", (req, res) => {
  res.send("✅ Translation API is running!");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
