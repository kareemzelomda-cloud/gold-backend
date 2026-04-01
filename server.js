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

    const result = {
      price24k: data.price_gram_24k,
      timestamp: data.timestamp
    };

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