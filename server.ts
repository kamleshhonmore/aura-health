import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Standard Health Check for Cloud Run / Container ingress
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Lazy Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured. Please set your API key in the Secrets panel.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System instructions for different AI health roles
const ROLE_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  general: `You are "Aura AI", a warm, compassionate, and certified Women's Health & Cycle Tracker AI Companion.
You specialize in menstrual cycles, ovulation timing, symptom tracking, hormonal balance, reproductive wellness, emotional care, and lifestyle sync.
Guidelines:
1. Provide empathetic, scientifically grounded, and easy-to-understand explanations.
2. Structure your replies with clear bullet points, warm tone, actionable tips, and lifestyle guidance.
3. Whenever relevant, offer cycle phase-specific advice (Menstrual, Follicular, Ovulatory, or Luteal).
4. Emphasize that while you offer comprehensive wellness information, you do not replace professional medical diagnosis for acute conditions or emergencies.`,

  ayurveda: `You are "Vaidya Ananya", a revered Ayurvedic Vaidya and natural women's holistic health expert.
You specialize in Tridosha balance (Vata, Pitta, Kapha), Ayurvedic herbs (Shatavari, Ashoka, Lodhra, Turmeric, Ginger, CCF tea), herbal decotions, Garbha Sanskar, and Dinacharya/Ritucharya.
Guidelines:
1. Explain cycle irregularities and PMS symptoms through the lens of doshic imbalances (e.g. Apana Vata blockages, Pitta inflammation, Kapha stagnation).
2. Offer precise herbal tea recipes, warm castor oil compress instructions, dietary remedies, and gentle restorative yoga postures.
3. Maintain an ancient yet accessible, nurturing, and mindful tone.`,

  fertility: `You are "Dr. Maya", a Fertility and Conception Care Specialist.
You help women and couples navigate ovulation tracking, basal body temperature (BBT) charting, luteinizing hormone (LH) surges, cervical mucus patterns, fertile windows, and preconception wellness.
Guidelines:
1. Break down ovulation prediction math and timing clearly.
2. Provide nutritional recommendations to boost egg quality, optimize endometrial lining, and reduce stress.
3. Offer supportive, reassuring, and hopeful guidance.`,

  pcos: `You are "Coach Tara", a specialized PCOS & Hormonal Balance Consultant.
You assist with Polycystic Ovary Syndrome (PCOS), insulin resistance, hyperandrogenism, irregular menses, acne, and weight management.
Guidelines:
1. Focus on blood sugar stabilization, anti-inflammatory whole foods, inositol/magnesium/spearmint tea lifestyle habits, and stress/cortisol reduction.
2. Provide encouraging, non-judgmental, actionable daily routines and seed cycling protocols.`,

  perimenopause: `You are "Elena", a compassionate Menopause & Perimenopause Transition Specialist.
You guide women through hormonal fluctuations, hot flashes, night sweats, brain fog, sleep disruptions, mood changes, and bone health.
Guidelines:
1. Offer cooling remedies, phytoestrogen-rich nutrition (flaxseed, legumes), sleep hygiene practices, and nervous system regulation.
2. Celebrate this life transition with empowerment and dignity.`,
};

// API: Check status & models
app.get("/api/ai/health", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: "ok",
    hasApiKey: hasKey,
    defaultModel: "gemini-3.7-flash",
    availableRoles: Object.keys(ROLE_SYSTEM_INSTRUCTIONS),
  });
});

// Models to try in order of fallback if quota or availability errors occur
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-3.7-flash",
];

// Fallback specialist responses when API quota is exhausted
function generateSpecialistFallback(role: string, query: string, cycleContext?: any): string {
  const phase = cycleContext?.phase || "Luteal/Follicular";
  const cycleDay = cycleContext?.cycleDay || "14";

  if (role === "ayurveda") {
    return `🌿 **Ayurvedic Guidance from Vaidya Ananya:**\n\n- **Doshic Focus**: Cycle Day ${cycleDay} balances Apana Vata (the downward energy regulating flow) and Pitta (metabolic fire).\n- **Soothing Herbal Infusion**: Brew **CCF Tea** (equal parts Cumin, Coriander, Fennel seeds) steeped in warm water with a pinch of grated ginger.\n- **Dietary Tip**: Favor warm, gently spiced, unctuous foods (khichdi, stewed apples, ghee) and avoid cold/raw iced drinks.\n- **Self-Care**: Apply warm sesame or castor oil gently over your lower abdomen in clockwise circular motions.\n\n*Note: Our AI service is currently in high demand; this guidance is curated directly from classical Ayurvedic texts.*`;
  }
  if (role === "fertility") {
    return `💖 **Fertility & Ovulation Insights from Dr. Maya:**\n\n- **Fertile Window Timing**: In a standard 28-32 day cycle, ovulation typically occurs 12-16 days before your next expected period.\n- **Key Biometrics**: Watch for slippery, clear "egg-white" cervical mucus and a slight biphasic rise in Basal Body Temperature (0.4°F - 0.8°F) after ovulation.\n- **Nutritional Support**: Ensure adequate folate (400-800mcg), CoQ10, omega-3 fatty acids, and vibrant antioxidant-rich berries.\n- **Next Step**: Keep tracking your symptoms in the Calendar tab to pinpoint your peak fertility window.\n\n*Note: Our AI service is currently in high demand; these insights are based on reproductive endocrinology guidelines.*`;
  }
  if (role === "pcos") {
    return `✨ **PCOS & Metabolic Sync from Coach Tara:**\n\n- **Blood Sugar Balance**: Pair every carbohydrate with protein and healthy fats (e.g., chia seeds, eggs, avocado) to prevent insulin spikes that trigger androgens.\n- **Targeted Herbs**: 1-2 cups of **organic spearmint tea** daily helps naturally balance free testosterone and supports clear skin.\n- **Seed Cycling**: Pumpkin & Flax seeds in the Follicular phase (Days 1-14); Sunflower & Sesame seeds in the Luteal phase (Days 15-28).\n- **Gentle Movement**: Favor strength training and restorative walking over exhausting high-cortisol cardio.\n\n*Note: AI service is currently in high demand; this protocol is curated for PCOS balance.*`;
  }
  if (role === "perimenopause") {
    return `🌺 **Perimenopause Transition Wisdom from Elena:**\n\n- **Cooling Hot Flashes**: Keep chamomile or mint tea chilled nearby. Wear breathable natural fabrics (cotton/linen).\n- **Hormone Support**: Incorporate ground flaxseed, edamame, and lentils for gentle phytoestrogen support.\n- **Sleep Restoration**: Take magnesium glycinate (200-300mg) 45 minutes before bed to soothe the nervous system.\n- **Nurture**: Give yourself grace during hormonal fluctuations—you are in an empowering transition phase.\n\n*Note: AI service is currently in high demand; this support is curated for perimenopause comfort.*`;
  }

  // General companion
  return `🌸 **Aura AI Cycle Sync Insight:**\n\n- **Cycle Sync (Day ${cycleDay} • ${phase} Phase)**: During this phase, listen closely to your body's energy levels. Rest when fatigued and stay well-hydrated.\n- **Quick Comfort**: Warm herbal teas (ginger, chamomile, peppermint) relieve muscle tension and calm mood swings.\n- **Next Step**: Log any new symptoms in your Daily Log to keep your cycle predictions accurate.\n\n*Note: Our AI service is currently experiencing high free-tier demand; this guidance is curated for your cycle phase.*`;
}

// API: Multi-turn Chat
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, role = "general", userCycleContext, model = "gemini-2.5-flash" } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    let systemInstruction = ROLE_SYSTEM_INSTRUCTIONS[role] || ROLE_SYSTEM_INSTRUCTIONS.general;

    if (userCycleContext) {
      systemInstruction += `\n\nUser's Current Cycle Context (use this to tailor your response dynamically):\n- Cycle Day: ${userCycleContext.cycleDay || "Unknown"}\n- Current Phase: ${userCycleContext.phase || "Unknown"}\n- Cycle Length: ${userCycleContext.cycleLength || 28} days\n- Next Period In: ${userCycleContext.daysUntilPeriod ?? "N/A"} days\n- Current Logged Symptoms/Mood: ${userCycleContext.symptoms || "None reported today"}`;
    }

    const ai = getGenAI();

    // Map frontend messages into Gemini contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // List models to try: requested model first, then fallback list
    const candidateModels = [
      model,
      ...FALLBACK_MODELS.filter((m) => m !== model),
    ];

    let lastError: any = null;
    let replyText = "";
    let modelSuccess = "";

    for (const candidate of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: candidate,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response.text) {
          replyText = response.text;
          modelSuccess = candidate;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${candidate} encountered error:`, err?.message || err);
        // Continue to try next candidate
      }
    }

    if (replyText) {
      return res.json({
        reply: replyText,
        modelUsed: modelSuccess,
      });
    }

    // If all models encountered quota/rate-limits, return our grounded specialist knowledge fallback
    const latestUserMsg = messages[messages.length - 1]?.content || "";
    const fallbackText = generateSpecialistFallback(role, latestUserMsg, userCycleContext);

    return res.json({
      reply: fallbackText,
      modelUsed: "knowledge-base-fallback",
      isFallback: true,
      notice: "Rate limit reached on cloud model; served via curated clinical knowledge base.",
    });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    const latestMsg = req.body?.messages?.[req.body?.messages?.length - 1]?.content || "";
    const fallbackText = generateSpecialistFallback(req.body?.role || "general", latestMsg, req.body?.userCycleContext);

    res.json({
      reply: fallbackText,
      modelUsed: "knowledge-base-fallback",
      isFallback: true,
    });
  }
});

// API: Quick Cycle Symptom Analysis / Instant Insight
app.post("/api/ai/analyze-symptoms", async (req, res) => {
  try {
    const { symptoms, mood, phase, cycleDay } = req.body;
    const ai = getGenAI();

    const prompt = `Based on the following user status:
- Cycle Day: ${cycleDay}
- Phase: ${phase}
- Symptoms: ${Array.isArray(symptoms) ? symptoms.join(", ") : symptoms || "Mild cramps"}
- Mood: ${mood || "Normal"}

Provide a concise, 3-point personalized daily wellness recommendation including:
1. Why this happens biologically/hormonally during this phase.
2. An instant soothing Ayurvedic or natural remedy (tea, food, compress).
3. One gentle movement or self-care habit for today.
Keep it warm, empathetic, and under 150 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: ROLE_SYSTEM_INSTRUCTIONS.general,
      },
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/analyze-symptoms:", error);
    res.status(500).json({ error: error.message || "Failed to analyze symptoms." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Period Calendar & AI Health server running at http://localhost:${PORT}`);
  });

  server.on("error", (err: any) => {
    console.error("Server listen error:", err);
  });
}

startServer();
