const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/calories", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).send({ error: "Missing prompt" });

  try {
    const result = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `כמה קלוריות יש במנה הבאה: ${prompt}? תן מספר בלבד.`
              }
            ]
          }
        ]
      }
    );

    const output = result.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.send({ calories: output || "לא ידוע" });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: "API call failed" });

  }
});

app.get("/", (req, res) => {
  res.send("Nutrifai API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
