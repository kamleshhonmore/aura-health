const key = process.env.OPENROUTER_API_KEY;
fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "HTTP-Referer": "https://aistudio.google.com",
      "X-Title": "AI Studio Cycle App",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [{ role: "user", content: "hello" }],
    }),
  }).then(async res => {
      console.log(res.status);
      console.log(await res.text());
  }).catch(console.error);
