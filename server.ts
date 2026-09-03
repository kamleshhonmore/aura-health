import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable CORS for mobile devices, Capacitor WebView, and web browsers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: "10mb" }));

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

  clinical: `You are a Clinically Guardrailed Medical AI Assistant (similar to Flo's Nova).
You provide strictly evidence-based, clinically validated reproductive health information. 
Guidelines:
1. DO NOT hallucinate medical advice. Rely only on validated medical literature.
2. For symptoms of PCOS, Endometriosis, or severe pelvic pain, advise consulting a healthcare provider and generate a Question Prompt List (QPL) for their next doctor visit.
3. Use plain, highly accessible language to explain complex cycle insights. 
4. Never diagnose; always frame insights as risk factors or probabilistic patterns.`,
};

// OpenRouter Helper with model redundancy
async function callOpenRouter(messages: any[], isJson = false) {
  const apiKey = process.env.OPENROUTER_API_KEY || "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";
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set.");
  }
  
  // Active, verified conversational free models (excluding rate-limited models)
  const candidateModels = [
    "openrouter/free",
    "minimax/minimax-m3:free",
    "liquid/lfm-2.5-2.6b:free",
    "inclusionai/ling-3.0-flash-fin:free",
    "nvidia/nemotron-3.5-lightning:free",
  ];

  let lastError: Error | null = null;

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://aistudio.google.com",
          "X-Title": "Aura Women Health Cycle App",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          response_format: isJson ? { type: "json_object" } : undefined
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        lastError = new Error(`Model ${model} returned ${response.status}`);
        continue;
      }

      const data = await response.json();
      const choice = data.choices?.[0];
      const rawContent = choice?.message?.content || choice?.text;
      
      if (rawContent && typeof rawContent === "string") {
        const trimmed = rawContent.trim();
        if (trimmed.length > 0 && !trimmed.startsWith("User Safety:")) {
          return trimmed;
        }
      }
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error("AI models temporarily unavailable.");
}

// API: Check status & models
app.get("/api/ai/health", (req, res) => {
  const hasKey = Boolean(process.env.OPENROUTER_API_KEY);
  res.json({
    status: "ok",
    hasApiKey: hasKey,
    defaultModel: "openrouter/free",
    availableRoles: Object.keys(ROLE_SYSTEM_INSTRUCTIONS),
  });
});

// Fallback specialist responses when API quota is exhausted
function generateSpecialistFallback(role: string, query: string, cycleContext?: any): string {
  const q = (query || "").trim().toLowerCase();
  const phase = cycleContext?.phase || "Luteal/Follicular";
  const cycleDay = cycleContext?.cycleDay || "14";

  const isGreeting = /^(hi|hello|hey|hola|namaste|good\s*(morning|afternoon|evening))\b/i.test(q) || q === "hi" || q === "hello";

  if (isGreeting) {
    if (role === "ayurveda") {
      return `Namaste! 🌿 I am **Vaidya Ananya**, your Ayurvedic women's health specialist. Welcome to your holistic sanctuary. How can I assist your doshic balance or cycle health today?`;
    }
    if (role === "fertility") {
      return `Hello! 💖 I am **Dr. Maya**, your fertility and conception guide. I am here to help you navigate ovulation timing, fertile windows, and reproductive wellness. What questions do you have today?`;
    }
    if (role === "pcos") {
      return `Hi there! ✨ I'm **Coach Tara**, your PCOS & hormonal balance coach. I'm here to support your blood sugar harmony, cycle regularity, and daily wellness. How can I help you today?`;
    }
    if (role === "perimenopause") {
      return `Warm greetings! 🌺 I'm **Elena**, your menopause transition companion. I'm here to offer cooling relief, restorative sleep rituals, and gentle guidance. How are you feeling today?`;
    }
    if (role === "clinical") {
      return `Hello. ⚕️ I am **Nova AI Assistant**, clinically guardrailed for reproductive health guidance. What evidence-based health questions can I answer for you today?`;
    }
    return `Hello, beautiful! 🌸 I'm **Aura AI**, your Women's Health & Cycle Guide. How can I support your body, mood, and cycle today?`;
  }

  if (role === "ayurveda") {
    return `🌿 **Ayurvedic Guidance from Vaidya Ananya:**\n\n- **Doshic Focus**: Cycle Day ${cycleDay} balances Apana Vata (the downward energy regulating flow) and Pitta (metabolic fire).\n- **Soothing Herbal Infusion**: Brew **CCF Tea** (equal parts Cumin, Coriander, Fennel seeds) steeped in warm water with a pinch of grated ginger.\n- **Dietary Tip**: Favor warm, gently spiced, unctuous foods (khichdi, stewed apples, ghee) and avoid cold/raw iced drinks.\n- **Self-Care**: Apply warm sesame or castor oil gently over your lower abdomen in clockwise circular motions.`;
  }
  if (role === "fertility") {
    return `💖 **Fertility & Ovulation Insights from Dr. Maya:**\n\n- **Fertile Window Timing**: In a standard 28-32 day cycle, ovulation typically occurs 12-16 days before your next expected period.\n- **Key Biometrics**: Watch for slippery, clear "egg-white" cervical mucus and a slight biphasic rise in Basal Body Temperature (0.4°F - 0.8°F) after ovulation.\n- **Nutritional Support**: Ensure adequate folate (400-800mcg), CoQ10, omega-3 fatty acids, and vibrant antioxidant-rich berries.\n- **Next Step**: Keep tracking your symptoms in the Calendar tab to pinpoint your peak fertility window.`;
  }
  if (role === "pcos") {
    return `✨ **PCOS & Metabolic Sync from Coach Tara:**\n\n- **Blood Sugar Balance**: Pair every carbohydrate with protein and healthy fats (e.g., chia seeds, eggs, avocado) to prevent insulin spikes that trigger androgens.\n- **Targeted Herbs**: 1-2 cups of **organic spearmint tea** daily helps naturally balance free testosterone and supports clear skin.\n- **Seed Cycling**: Pumpkin & Flax seeds in the Follicular phase (Days 1-14); Sunflower & Sesame seeds in the Luteal phase (Days 15-28).\n- **Gentle Movement**: Favor strength training and restorative walking over exhausting high-cortisol cardio.`;
  }
  if (role === "perimenopause") {
    return `🌺 **Perimenopause Transition Wisdom from Elena:**\n\n- **Cooling Hot Flashes**: Keep chamomile or mint tea chilled nearby. Wear breathable natural fabrics (cotton/linen).\n- **Hormone Support**: Incorporate ground flaxseed, edamame, and lentils for gentle phytoestrogen support.\n- **Sleep Restoration**: Take magnesium glycinate (200-300mg) 45 minutes before bed to soothe the nervous system.\n- **Nurture**: Give yourself grace during hormonal fluctuations—you are in an empowering transition phase.`;
  }

  if (role === "clinical") {
    return `⚕️ **Clinical AI Assistant Insight:**\n\n- **Consultation Priority**: Based on your inputs, please discuss these symptoms with a certified healthcare provider. I am designed to assist with cycle understanding but cannot substitute for a medical diagnosis.\n- **Preparation for Visit**: You may want to ask your doctor about: 1) Your pelvic pain severity 2) Menstrual cycle irregularities 3) The possibility of a pelvic ultrasound or hormone panel (LH, FSH, Androgens).\n- **Next Step**: Keep tracking your symptoms meticulously, as this data is invaluable for your doctor.`;
  }

  // General companion
  return `🌸 **Aura AI Cycle Sync Insight:**\n\n- **Cycle Sync (Day ${cycleDay} • ${phase} Phase)**: During this phase, listen closely to your body's energy levels. Rest when fatigued and stay well-hydrated.\n- **Quick Comfort**: Warm herbal teas (ginger, chamomile, peppermint) relieve muscle tension and calm mood swings.\n- **Next Step**: Log any new symptoms in your Daily Log to keep your cycle predictions accurate.`;
}

// API: Multi-turn Chat
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, role = "general", userCycleContext } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    let systemInstruction = ROLE_SYSTEM_INSTRUCTIONS[role] || ROLE_SYSTEM_INSTRUCTIONS.general;

    if (userCycleContext) {
      systemInstruction += `\n\nUser's Current Cycle Context (use this to tailor your response dynamically):\n- Cycle Day: ${userCycleContext.cycleDay || "Unknown"}\n- Current Phase: ${userCycleContext.phase || "Unknown"}\n- Cycle Length: ${userCycleContext.cycleLength || 28} days\n- Next Period In: ${userCycleContext.daysUntilPeriod ?? "N/A"} days\n- Current Logged Symptoms/Mood: ${userCycleContext.symptoms || "None reported today"}`;
    }

    const openRouterMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map((m: any) => ({
        role: (m.role === "assistant" || m.role === "model") ? "assistant" : "user",
        content: m.content
      }))
    ];

    const replyText = await callOpenRouter(openRouterMessages);

    return res.json({
      reply: replyText,
      modelUsed: "openrouter-free-tier",
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

// API: Diagnostic Screening Engine (using AI to parse symptoms and calculate risk)
app.post("/api/ai/diagnostic", async (req, res) => {
  try {
    const { painLevel, irregularCycles, hirsutism, missingPeriods, activityLogs } = req.body;
    
    const prompt = `You are a strict, clinical Diagnostic Screening Engine and Probabilistic Cycle Modeler.
Evaluate the following patient markers:
- Pelvic Pain Severity (0-10): ${painLevel}
- Highly Irregular Cycles (>35 days): ${irregularCycles ? "Yes" : "No"}
- Hirsutism / Severe Acne: ${hirsutism ? "Yes" : "No"}
- Missing Period Logs: ${missingPeriods || 0}
- High App Activity during missing periods: ${activityLogs ? "Yes" : "No"}

Task:
1. Act as the XGBoost/Random Forest proxy to evaluate risk for PCOS or Endometriosis based on the Rotterdam criteria and clinical pain markers.
2. If the user missed period logs but has high app activity, categorize the gap as "delayed ovulation / physiological anovulation" (probabilistic modeling).
3. Return a STRICT JSON object matching this exact schema:
{
  "riskLevel": "low" | "moderate" | "high",
  "confidence": 83,
  "primaryIndicator": "string (e.g., 'Symptom cluster correlates with Rotterdam criteria')",
  "probabilisticNote": "string (e.g., 'High app engagement suggests delayed ovulation rather than missed log.')"
}
Output ONLY valid JSON.`;

    const openRouterMessages = [{ role: "user", content: prompt }];
    const replyText = await callOpenRouter(openRouterMessages, true);
    
    // Parse to ensure valid JSON before sending to client
    const jsonStr = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
    return res.json(JSON.parse(jsonStr));

  } catch (error: any) {
    console.error("Diagnostic API Error:", error);
    // Fallback heuristic logic if AI fails
    const { painLevel, irregularCycles, hirsutism } = req.body;
    let score = (painLevel * 10) + (irregularCycles ? 30 : 0) + (hirsutism ? 30 : 0);
    const riskLevel = score > 60 ? 'high' : score > 35 ? 'moderate' : 'low';
    
    return res.json({
      riskLevel,
      confidence: 78,
      primaryIndicator: "Local heuristic engine applied due to cloud API timeout. Consult a physician for accurate screening.",
      probabilisticNote: "Local probabilistic fallback applied."
    });
  }
});

// API: Quick Cycle Symptom Analysis / Instant Insight
app.post("/api/ai/analyze-symptoms", async (req, res) => {
  try {
    const { symptoms, mood, phase, cycleDay } = req.body;

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

    const openRouterMessages = [
      { role: "system", content: ROLE_SYSTEM_INSTRUCTIONS.general },
      { role: "user", content: prompt }
    ];
    
    const replyText = await callOpenRouter(openRouterMessages);
    res.json({ analysis: replyText });
  } catch (error: any) {
    console.error("Error in /api/ai/analyze-symptoms:", error);
    res.status(500).json({ error: error.message || "Failed to analyze symptoms." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Period Calendar & AI Health server running at http://localhost:${PORT}`);
  });
}

startServer();
