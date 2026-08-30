require('dotenv').config();
fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://aistudio.google.com",
      "X-Title": "AI Studio Cycle App",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [{ role: "user", content: "hello" }],
    }),
  }).then(async res => {
      console.log(res.status);
      console.log(await res.text());
  }).catch(console.error);
