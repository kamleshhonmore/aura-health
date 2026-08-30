import fetch from "node-fetch";

async function run() {
  const res = await fetch("http://localhost:3000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "Tell me about cycles." }] })
  });
  const data = await res.json();
  console.log(data);
}
run();
