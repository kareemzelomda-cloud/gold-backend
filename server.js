import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const API_KEY = "goldapi-sopsmn7n1460-io";

// caching
let cachedData = null;
let lastFetch = 0;

app.get("/api/gold-price", async (req, res) => {
  const now = Date.now();

  if (cachedData && (now - lastFetch < 60000)) {
    return res.json(cachedData);
  }

  try {
    const response = await fetch("https://www.goldapi.io/api/XAU/EGP", {
      headers: {
        "x-access-token": API_KEY
      }
    });

    const data = await response.json();

const data = await response.json();

if (!data || data.error) {
  console.log("API ERROR:", data);
  return res.status(500).json({
    error: "Gold API failed",
    details: data
  });
}

const result = {
  price24k: data.price_gram_24k || 0,
  price21k: data.price_gram_21k || 0,
  price18k: data.price_gram_18k || 0,
  timestamp: data.timestamp || Date.now()
};

res.json(result);

    cachedData = result;
    lastFetch = now;

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: "فشل في جلب السعر" });
  }
});
app.get("/", (req, res) => {
  res.send("Gold API is running 🚀");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
