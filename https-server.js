// ============================
// https-server.js (WINDOWS SAFE VERSION)
// No OpenSSL Required
// ============================

import express from "express";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import selfsigned from "selfsigned";

// Fix dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// SSL directory
const certDir = path.join(__dirname, "certs");
const keyPath = path.join(certDir, "key.pem");
const certPath = path.join(certDir, "cert.pem");

// Create certs folder if missing
if (!fs.existsSync(certDir)) fs.mkdirSync(certDir);

// If certificates missing → generate using JS (NO OpenSSL)
if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.log("🔧 Generating SSL Certificates (Windows compatible)…");

  const attrs = [{ name: "commonName", value: "localhost" }];
  const pems = selfsigned.generate(attrs, { days: 365 });

  fs.writeFileSync(keyPath, pems.private);
  fs.writeFileSync(certPath, pems.cert);

  console.log("✅ SSL Certificates created successfully.");
}

const httpsServer = https.createServer(
  {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  },
  app
);

// Main route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = 5000;
httpsServer.listen(PORT, () => {
  console.log(`\n🚀 HTTPS Server Running`);
  console.log(`👉 Open: https://localhost:${PORT}\n`);
});
