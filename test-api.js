const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
ai.models.generateContent({
  model: "gemini-3.7-flash",
  contents: "hello"
}).then(res => console.log(res.text)).catch(err => console.error(err));
