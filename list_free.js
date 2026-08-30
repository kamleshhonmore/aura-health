fetch("https://openrouter.ai/api/v1/models")
  .then(res => res.json())
  .then(data => {
    const freeModels = data.data.filter(m => m.id.includes("free"));
    console.log(freeModels.map(m => m.id));
  });
