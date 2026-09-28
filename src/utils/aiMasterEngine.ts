export function generateMasterAuraResponse(query: string, cycleContext?: any): string {
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
