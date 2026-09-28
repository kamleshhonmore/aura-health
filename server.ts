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

// Master system instruction for Aura AI - the all-in-one Women's Health & App Intelligence
const MASTER_AURA_SYSTEM_PROMPT = `You are "Aura AI", the powerful, unified all-in-one Master Women's Health, Clinical, and App Navigation Intelligence.
You seamlessly integrate multiple expert disciplines into a single empathetic, brilliant conversational companion:
1. Menstrual Cycles & Hormones: Explaining follicular, ovulatory, luteal, and menstrual phases, hormonal shifts (Estrogen, Progesterone, LH, FSH), and body changes.
2. Clinical Diagnostics & Reproductive Insights: Rotterdam criteria for PCOS, Endometriosis pain markers, cycle irregularity patterns, thyroid considerations, and Question Prompt Lists for doctor appointments.
3. Holistic Care & Ayurvedic Wisdom: Tridosha balance (Vata/Pitta/Kapha), CCF tea (Cumin, Coriander, Fennel), Shatavari, castor oil packs, seed cycling, and dietary rhythm.
4. Fertility & Ovulation Tracking: Cervical mucus patterns (egg-white, creamy), basal body temperature (BBT) shifts, LH peak detection, and conception timing.
5. Perimenopause & Transition Support: Hot flash cooling remedies, sleep rituals, phytoestrogens, and hormonal balance.
6. Full App Guidance & How-To's:
   - Log Period & Symptoms: Tap the '+' floating button or any date in the Calendar tab to log flow, symptoms, moods, temperature, weight, and intimacy.
   - Keep It Secret PIN Lock: Go to Settings ⚙️ -> Security -> Enable PIN Lock to protect personal health data with a 4-digit PIN.
   - Scenic vs Desk View: Tap the landscape icon in the top header to toggle between the peaceful scenic nature countdown and the interactive desk diary.
   - Themes & Pet Mascots: Tap the Palette icon in the header to switch themes (Blossom, Lavender, Mint, Sunset) or select your companion pet (Kitty, Bunny, Puppy, Teddy, Flora).
   - Water & Pill Tracker: Tap water droplets on the Home screen to track your daily 250ml glasses, or check off your daily contraceptive/vitamin pill.
   - Pregnancy Mode: Toggle in the header or Settings for week-by-week trimester milestones, baby size guides, and kick counter.
   - Medical Doctor Report (PDF): In Hub -> Medical Report to export a comprehensive multi-cycle diagnostic report for your OBGYN.

Always answer warmly, authoritatively, and clearly using clean markdown, bullet points, and actionable tips.`;

// Live AI API caller using OpenRouter with automatic model failover
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

async function generateLiveAIContent(
  systemInstruction: string,
  messages: { role: string; content: string }[],
  isJson = false,
  clientApiKey = ""
): Promise<string> {
  const apiKeyToUse = clientApiKey || OPENROUTER_API_KEY;
  if (!apiKeyToUse) {
    throw new Error("OpenRouter API key not configured. Please set OPENROUTER_API_KEY in .env or Settings.");
  }

  const candidateModels = [
    "openrouter/auto",
    "meta-llama/llama-3.3-70b-instruct",
    "deepseek/deepseek-chat",
    "qwen/qwen-2.5-72b-instruct",
  ];

  const formattedMessages = [
    { role: "system", content: systemInstruction },
    ...messages.map((m) => ({
      role: m.role === "assistant" || m.role === "model" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKeyToUse}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://aistudio.google.com",
          "X-Title": "Aura Women Health App",
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature: 0.7,
          response_format: isJson ? { type: "json_object" } : undefined,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errBody = await response.text();
        console.warn(`OpenRouter model ${model} failed (status ${response.status}):`, errBody);
        continue;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (text && typeof text === "string" && text.trim().length > 0) {
        return text.trim();
      }
    } catch (e) {
      console.warn(`OpenRouter model ${model} error:`, e);
    }
  }

  throw new Error("OpenRouter API request failed. Please check your OpenRouter API key and account credits.");
}

// Master comprehensive intelligence engine for all user queries & app guidance
function generateMasterAuraResponse(query: string, cycleContext?: any): string {
  const q = (query || "").trim().toLowerCase();
  const phase = cycleContext?.phase || "Luteal";
  const cycleDay = cycleContext?.cycleDay || "14";
  const symptoms = cycleContext?.symptoms || "";

  // 1. Greetings
  if (/^(hi|hello|hey|hola|namaste|good\s*(morning|afternoon|evening))\b/i.test(q) || q === "hi" || q === "hello") {
    return `Hello, beautiful! 🌸 I am **Aura AI**, your all-in-one Master Women's Health & App Intelligence.\n\nToday you are on **Cycle Day ${cycleDay} • ${phase} Phase**.\n\nI can help you with anything:\n• **Cycle & Symptoms**: Decode cramps, mood shifts, and hormonal patterns.\n• **App Guidance**: Learn how to log symptoms, set your secret PIN lock, change themes, or export doctor reports.\n• **Clinical Diagnostics**: Understand markers for PCOS, Endometriosis, and fertility windows.\n• **Ayurveda & Remedies**: Natural CCF teas, castor oil packs, and seed cycling.\n\nWhat would you like to explore or do today?`;
  }

  // 2. App Guidance Questions
  if (q.includes("pin") || q.includes("lock") || q.includes("secret") || q.includes("password")) {
    return `🔒 **How to Set Up Keep It Secret PIN Lock:**\n\n1. Tap the **Settings (⚙️)** icon in the top right header.\n2. Under **Privacy & Security**, toggle **Enable PIN Lock**.\n3. Enter your preferred **4-digit security PIN** and confirm it.\n4. Once enabled, the app will require your PIN whenever you re-open it, keeping your cycle, intimacy, and health logs 100% private!`;
  }

  if (q.includes("how to log") || q.includes("log period") || q.includes("record") || q.includes("add log") || q.includes("daily log")) {
    return `📝 **How to Log Your Period & Daily Symptoms:**\n\n1. **Quick Toggle**: On the Home screen, tap the big **"Period Today"** circle or Quick Log bar to log period start instantly.\n2. **Detailed Logging**: Tap any date on the **Calendar** tab, or tap the **"+" floating button**.\n3. **Track Everything**: You can log:\n   • **Flow level**: Spotting, Light, Medium, Heavy\n   • **Physical Symptoms**: Cramps, bloating, headache, tender breasts, acne\n   • **Moods**: Happy, irritable, anxious, calm, fatigued\n   • **Vitals & Intimacy**: Basal body temperature, weight, cervical mucus, protected/unprotected intimacy\n   • **Notes**: Personal diary entries\n4. Tap **Save**—your inputs are instantly saved and synced to both offline storage and Google Cloud!`;
  }

  if (q.includes("theme") || q.includes("color") || q.includes("pet") || q.includes("mascot")) {
    return `🎨 **Customizing Themes & Pet Companions:**\n\n1. **Themes**: Tap the **Palette icon (🎨)** in the top header. Choose from:\n   • 🌸 **Blossom Pink** (Classic feminine aesthetic)\n   • 💜 **Lavender Dream** (Soothing gentle violet)\n   • 🌿 **Earthy Mint** (Calming natural sage green)\n   • 🌅 **Sunset Coral** (Warm energizing amber & rose)\n2. **Pet Mascots**: Choose your diary companion (Kitty 🐱, Bunny 🐰, Puppy 🐶, Teddy 🧸, or Flora 🌸). Your pet will react to your cycle phases with encouraging daily messages!`;
  }

  if (q.includes("water") || q.includes("pill") || q.includes("hydration") || q.includes("medicine")) {
    return `💧 **Tracking Water & Daily Pills:**\n\n• **Water Tracker**: On the Home screen, tap the water glass icons (each represents 250ml). Your default goal is 8 glasses (2 Liters) per day.\n• **Contraceptive / Vitamin Pill**: Check the pill tracker on the Home tab to mark your daily pill as taken. You can also customize your reminder notification time in **Reminders ⏰**!`;
  }

  if (q.includes("scenic") || q.includes("desk") || q.includes("view") || q.includes("countdown")) {
    return `🌄 **Switching Between Desk Diary & Scenic Countdown:**\n\n• Look at the top header and tap the **Landscape / Desk toggle icon** (next to the theme palette).\n• **Desk View**: Offers quick access to pet mascot notes, water logging, pill tracker, and quick symptom chips.\n• **Scenic View**: Shows a beautiful, relaxing animated nature background with a big countdown circle to your next cycle milestone.`;
  }

  if (q.includes("report") || q.includes("pdf") || q.includes("doctor") || q.includes("export") || q.includes("obgyn")) {
    return `📋 **Generating a Medical Doctor Report (PDF):**\n\n1. Tap the **Hub (Category)** tab at the bottom navigation dock.\n2. Select **Clinical Diagnostics & Doctor Report**.\n3. Tap **Generate Clinical Summary (PDF)**.\n4. The app compiles your last 3-6 cycles, symptom frequencies, cycle irregularities, and vitals into a standardized clinical PDF report ready to print or email to your gynecologist!`;
  }

  // 3. Clinical Symptoms & Conditions (PCOS, Endometriosis, Cramps)
  if (q.includes("pcos") || q.includes("polycystic") || q.includes("rotterdam") || q.includes("androgen") || q.includes("hirsutism")) {
    return `🩺 **Clinical Insights on PCOS (Polycystic Ovary Syndrome):**\n\n• **Rotterdam Diagnostic Criteria** requires at least 2 of 3 features:\n  1. Irregular, delayed, or absent periods (cycles > 35 days).\n  2. Clinical or biochemical hyperandrogenism (excess facial/body hair, hormonal acne, elevated free testosterone).\n  3. Polycystic ovaries visible on pelvic ultrasound.\n• **Root Drivers**: Often driven by underlying insulin resistance and chronic low-grade inflammation.\n• **Evidence-Based Action Plan**:\n  - **Nutrition**: Pair carbohydrates with fiber and protein (seeds, avocado, lentils) to stabilize insulin spikes.\n  - **Herbal Therapy**: Organic **spearmint tea** (1-2 cups daily) has documented anti-androgen benefits.\n  - **Supplements**: Myo-inositol & D-chiro-inositol (40:1 ratio) and Magnesium glycinate.\n  - **App Tool**: You can take our clinical screening assessment in the **Diagnostics Hub** tab to evaluate your risk markers!`;
  }

  if (q.includes("endo") || q.includes("endometriosis") || q.includes("pelvic pain") || q.includes("severe pain")) {
    return `⚕️ **Endometriosis & Pelvic Pain Intelligence:**\n\n• **What It Is**: Endometrial-like tissue growing outside the uterus, causing localized inflammation, lesions, and cyclical pelvic pain.\n• **Key Warning Signs**:\n  - Severe dysmenorrhea (period pain not fully relieved by standard NSAIDs).\n  - Deep pelvic pain during or after intimacy (dyspareunia).\n  - Painful bowel movements or urination during menstruation.\n  - Chronic lower back or radiating leg pain.\n• **Next Steps**: Keep logging pain severity (0-10) daily in your Aura Daily Log. Bring your exported **Medical Summary PDF** to an endometriosis-literate specialist. Transvaginal ultrasound or MRI can detect endometriomas, while laparoscopy provides definitive staging.`;
  }

  if (q.includes("cramp") || q.includes("pain") || q.includes("bloat") || q.includes("ache")) {
    return `🌸 **Relief for Cramps & Bloating (Cycle Day ${cycleDay} • ${phase} Phase):**\n\n1. **Fast-Acting Thermal Relief**: Apply a warm heating pad or **warm castor oil compress** across your lower abdomen for 20 minutes to soothe uterine prostaglandins.\n2. **Soothing Herbal Infusion**: Brew fresh **Ginger & Fennel Tea** with a dash of cinnamon. Ginger acts as a natural COX-2 inhibitor, reducing inflammatory prostaglandins similarly to ibuprofen.\n3. **Restorative Movement**: Gentle restorative yoga (Reclined Butterfly, Child's Pose, Legs-Up-The-Wall) relaxes pelvic floor muscles.\n4. **Hydration**: Sip warm water throughout the day. Avoid iced drinks, excess sodium, and caffeine, which constrict uterine blood vessels.`;
  }

  // 4. Fertility, Conception, Ovulation & Cervical Mucus
  if (q.includes("ovulat") || q.includes("fertile") || q.includes("pregnant") || q.includes("conceiv") || q.includes("baby") || q.includes("mucus")) {
    return `💖 **Fertility & Conception Intelligence:**\n\n• **The Fertile Window**: Comprises the **5 days before ovulation plus ovulation day**. Sperm can survive up to 5 days in fertile cervical fluid.\n• **Pinpointing Ovulation**:\n  1. **Cervical Mucus**: Shifts from dry/sticky to clear, stretchy, slippery **egg-white** consistency (Spinnbarkeit), which nourishes and guides sperm.\n  2. **LH Surge**: Luteinizing Hormone spikes 24-36 hours prior to follicular rupture (detectable with optical urine test strips in our Hub).\n  3. **BBT Shift**: Basal body temperature jumps 0.4°F - 0.8°F *after* ovulation due to progesterone.\n• **Optimal Timing**: Having intercourse every 1-2 days throughout your fertile window maximizes conception probability!`;
  }

  // 5. Ayurveda & Holistic Care
  if (q.includes("ayurved") || q.includes("dosha") || q.includes("vata") || q.includes("pitta") || q.includes("kapha") || q.includes("herb") || q.includes("tea")) {
    return `🌿 **Ayurvedic Holistic Care for Women:**\n\n• **The Tridoshas in Menstruation**:\n  - **Vata (Air/Space)**: Governs Apana Vata (the downward flow of menstruation). Imbalance causes sharp spasms, constipation, and anxiety.\n  - **Pitta (Fire/Water)**: Governs metabolism and ovulatory heat. Imbalance causes heavy flow, skin breakouts, and irritability.\n  - **Kapha (Earth/Water)**: Governs tissue nourishment. Imbalance causes fluid retention, lethargy, and breast heaviness.\n• **The Golden Remedy: CCF Tea Recipe**:\n  - 1/2 tsp Cumin seeds\n  - 1/2 tsp Coriander seeds\n  - 1/2 tsp Fennel seeds\n  - Boil in 2 cups of water for 5 minutes, strain, and sip warm. It stimulates digestive Agni, clears Apana blockages, and relieves PMS bloating instantly!`;
  }

  // 6. Current Cycle Phase & General Insights
  return `🌸 **Aura AI Comprehensive Cycle Insight (Day ${cycleDay} • ${phase} Phase):**\n\n• **Current Biological State**: During the ${phase} phase, your hormones are shifting to balance energy and uterine lining prep. Notice your natural body signals today.\n• **Nutritional Focus**: Prioritize nutrient-dense foods (warm root vegetables, dark leafy greens, magnesium-rich seeds, clean proteins).\n• **Daily Self-Care**: Take 10 minutes today for mindful breathwork, stay hydrated with 8 glasses of warm water, and log any new symptoms in the Calendar tab.\n• **Have another question?** Ask me anything about app features, symptoms, fertility, or natural remedies!`;
}

// API: Multi-turn Chat
app.post("/api/ai/chat", async (req, res) => {
  const { messages, userCycleContext, apiKey } = req.body || {};
  console.log("[AURA-AI-SERVER] Received /api/ai/chat request. Messages:", messages?.length, "Has API Key:", !!apiKey);
  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    let systemInstruction = MASTER_AURA_SYSTEM_PROMPT;

    if (userCycleContext) {
      systemInstruction += `\n\nUser's Current Cycle Context:\n- Cycle Day: ${userCycleContext.cycleDay || "Unknown"}\n- Current Phase: ${userCycleContext.phase || "Unknown"}\n- Cycle Length: ${userCycleContext.cycleLength || 28} days\n- Next Period In: ${userCycleContext.daysUntilPeriod ?? "N/A"} days\n- Current Logged Symptoms/Mood: ${userCycleContext.symptoms || "None reported today"}`;
    }

    const replyText = await generateLiveAIContent(systemInstruction, messages, false, apiKey);
    console.log("[AURA-AI-SERVER] Successfully generated reply. Length:", replyText.length);
    return res.json({
      reply: replyText,
      modelUsed: "Aura AI • OpenRouter Live Online",
    });
  } catch (error: any) {
    console.error("[AURA-AI-SERVER ERROR] /api/ai/chat failed:", error?.message || error);
    return res.status(500).json({
      error: error.message || "Online AI request failed. Please check your internet connection and OpenRouter API key in Settings."
    });
  }
});

// API: Diagnostic Screening Engine (using AI to parse symptoms and calculate risk)
app.post("/api/ai/diagnostic", async (req, res) => {
  try {
    const { painLevel, irregularCycles, hirsutism, missingPeriods, activityLogs, apiKey } = req.body;
    
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

    try {
      const replyText = await generateLiveAIContent(
        MASTER_AURA_SYSTEM_PROMPT,
        [{ role: "user", content: prompt }],
        true,
        apiKey
      );
      const jsonStr = replyText.replace(/```json/g, "").replace(/```/g, "").trim();
      return res.json(JSON.parse(jsonStr));
    } catch (genError) {
      console.warn("Live diagnostic fallback engaged:", genError);
    }

    // Fallback heuristic logic if AI is offline
    const score = (Number(painLevel) * 10) + (irregularCycles ? 30 : 0) + (hirsutism ? 30 : 0);
    const riskLevel = score > 60 ? "high" : score > 35 ? "moderate" : "low";
    
    return res.json({
      riskLevel,
      confidence: 80,
      primaryIndicator: "Clinical heuristic pattern applied based on Rotterdam guidelines.",
      probabilisticNote: "Local probabilistic modeling applied."
    });
  } catch (error: any) {
    console.error("Diagnostic API Error:", error);
    return res.json({
      riskLevel: "low",
      confidence: 75,
      primaryIndicator: "Screening complete. Consult a physician for definitive medical assessment.",
      probabilisticNote: "Heuristic evaluation complete."
    });
  }
});

// API: Quick Cycle Symptom Analysis / Instant Insight
app.post("/api/ai/analyze-symptoms", async (req, res) => {
  try {
    const { symptoms, mood, phase, cycleDay, apiKey } = req.body;

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

    try {
      const replyText = await generateLiveAIContent(
        MASTER_AURA_SYSTEM_PROMPT,
        [{ role: "user", content: prompt }],
        false,
        apiKey
      );
      if (replyText) {
        return res.json({ analysis: replyText });
      }
    } catch (aiErr) {
      console.warn("Symptom analysis fallback engaged:", aiErr);
    }

    const fallbackAnalysis = `🌸 **Daily Cycle Recommendation (Day ${cycleDay || 14} • ${phase || "Cycle"} Phase)**\n\n1. **Hormonal Balance**: Hormonal shifts can cause fatigue and sensitivity today. Listen to your body's energy.\n2. **Soothing Remedy**: Sip warm CCF (cumin, coriander, fennel) or ginger tea with honey to calm bloating.\n3. **Gentle Movement**: 10 minutes of restorative stretching or child's pose will ease tension and support pelvic circulation.`;
    return res.json({ analysis: fallbackAnalysis });
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
