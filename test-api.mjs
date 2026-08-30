const key = "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";
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
});
const text = await response.text();
console.log(response.status, text);
