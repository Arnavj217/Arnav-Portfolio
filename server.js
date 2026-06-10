import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("KEY:", process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const lastMessage =
      messages[messages.length - 1]?.content || "";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: lastMessage,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini Status:", response.status);
    console.log(JSON.stringify(data, null, 2));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});