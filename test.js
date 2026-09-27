fetch("http://localhost:3000/api/ai/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] })
}).then(res => res.json()).then(console.log);
