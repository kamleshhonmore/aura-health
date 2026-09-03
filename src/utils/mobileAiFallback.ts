import { CycleStatus } from './cycleCalculations';

interface FallbackContext {
  cycleStatus?: CycleStatus;
  userSymptoms?: string[];
  userMoods?: string[];
}

export function generateMobileOfflineResponse(
  query: string,
  role: string = 'general',
  context?: FallbackContext
): string {
  const q = query.trim().toLowerCase();
  const day = context?.cycleStatus?.currentCycleDay ?? 14;
  const phase = context?.cycleStatus?.phaseTitle || context?.cycleStatus?.phase || 'Cycle Sync';
  const symptoms = context?.userSymptoms && context.userSymptoms.length > 0 ? context.userSymptoms.join(', ') : '';

  // 1. Greetings (Hi, Hello, Hey, etc.)
  if (
    /^(hi|hello|hey|hola|namaste|good\s*(morning|afternoon|evening)|howdy|sup|greetings)\b/i.test(q) ||
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey'
  ) {
    switch (role) {
      case 'ayurveda':
        return `Namaste! 🌿 I am **Vaidya Ananya**, your Ayurvedic women's wellness expert.\n\nIn classical Ayurveda, your menstrual rhythm reflects your **Tridosha harmony** (Vata, Pitta, and Kapha). Today is **Cycle Day ${day} (${phase} phase)**.\n\nHow can I support your natural balance today?\n- ☕ **Herbal Teas**: Soothing CCF tea, ginger infusions, or Shatavari decoctions\n- 🧘‍♀️ **Dosha Care**: Grounding Apana Vata routines for cramp relief\n- 🥗 **Ayurvedic Diet**: Warm, easily digestible foods for your phase`;

      case 'fertility':
        return `Hello there! 💖 I am **Dr. Maya**, your fertility & conception care specialist.\n\nTracking your reproductive biometrics empowers your journey. Today is **Cycle Day ${day} (${phase} phase)**.\n\nWhat would you like to explore today?\n- 🎯 **Fertile Window Timing**: Pinpoint peak ovulation and LH surge\n- 🌡️ **BBT Charting**: Understand basal body temperature patterns\n- 🍳 **Egg Quality & Preconception**: Nutrient-dense foods for reproductive wellness`;

      case 'pcos':
        return `Hi there! ✨ I'm **Coach Tara**, your PCOS & hormonal balance consultant.\n\nLiving with PCOS is about nurturing metabolic peace and steady blood sugar. Today is **Cycle Day ${day} (${phase} phase)**.\n\nHow can I help you feel your best today?\n- 🍵 **Hormone Balance**: Organic spearmint tea for healthy androgens\n- 🥑 **Blood Sugar Balance**: Protein & healthy fat combinations\n- 🌻 **Seed Cycling**: Phase-specific seed protocols for regular menses`;

      case 'perimenopause':
        return `Warm welcome! 🌺 I'm **Elena**, your perimenopause & transition guide.\n\nEvery woman's journey through hormonal shifts is unique. Today is **Cycle Day ${day} (${phase} phase)**.\n\nHow can I support you right now?\n- ❄️ **Cooling Relief**: Natural remedies for hot flashes & night sweats\n- 🌙 **Restful Sleep**: Nervous system relaxation & magnesium rituals\n- 🥗 **Phytoestrogen Nutrition**: Gentle dietary support for declining estrogen`;

      case 'clinical':
        return `Hello. ⚕️ I am **Nova AI Assistant**, clinically guardrailed for reproductive health guidance.\n\nI offer evidence-based clinical information grounded in validated medical literature. Today is **Cycle Day ${day} (${phase} phase)**.\n\nWhat clinical topic can I help explain today?\n- 📋 **Diagnostic Criteria**: Rotterdam guidelines for PCOS & Endometriosis\n- 🩺 **Doctor Visit Prep**: Generate a Question Prompt List (QPL) for your OBGYN\n- 🔬 **Lab Biomarkers**: Understanding LH, FSH, Estradiol, and Progesterone`;

      default:
        return `Hello, beautiful! 🌸 I'm **Aura AI**, your personalized Women's Health & Cycle Guide.\n\nI am right here with you! Today is **Cycle Day ${day} (${phase} phase)**${symptoms ? ` and you've logged: *${symptoms}*` : ''}.\n\nHow can I support your body and mind today?\n- 📅 **Cycle Insights**: What your hormones are doing right now\n- 🌸 **Symptom Relief**: Natural relief for cramps, fatigue, or mood shifts\n- 🥑 **Phase Nutrition**: Best foods to eat during the ${phase} phase\n- 🧘‍♀️ **Movement & Rest**: How to align your workouts with your energy`;
    }
  }

  // 2. Cramps / Pelvic Pain
  if (q.includes('cramp') || q.includes('pain') || q.includes('ache') || q.includes('dysmenorrhea')) {
    return `🌸 **Soothing Relief for Menstrual Cramps (Cycle Day ${day} • ${phase}):**\n\nMenstrual cramps are triggered by **prostaglandins**, hormone-like lipids that make the uterine muscles contract to shed the endometrium.\n\n### 🌿 Fast Action Comfort:\n- **Warm Heating Pad**: Place a warm compress or castor oil pack on your lower abdomen for 15–20 minutes. Heat increases pelvic blood flow and relaxes smooth muscle.\n- **Ginger & Cinnamon Infusion**: Brew fresh grated ginger with a dash of cinnamon. Ginger is clinically shown to match ibuprofen's efficacy in reducing pain severity.\n- **Magnesium Glycinate (200–300mg)**: Helps relax contracted uterine muscles and calms nerve endings.\n- **Gentle Yoga**: Child's Pose (*Balasana*) and Supta Baddha Konasana open the pelvis and relieve lumbar tension.\n\n*⚠️ Red Flag Note: If pain is debilitating, radiates down the thighs, or resists over-the-counter relief, please consult an OBGYN to evaluate for endometriosis.*`;
  }

  // 3. Fatigue / Tiredness / Low Energy
  if (q.includes('fatigue') || q.includes('tired') || q.includes('exhausted') || q.includes('energy') || q.includes('sleepy')) {
    return `⚡ **Understanding Low Energy (Cycle Day ${day} • ${phase}):**\n\nYour energy naturally ebbs and flows with estrogen and progesterone:\n\n- **In the Luteal/Pre-menstrual Phase**: Progesterone peaks, raising your basal body temperature and metabolic demand while having a natural mild sedative effect.\n- **During Menstruation**: Both hormones drop to baseline while your body expends significant energy on uterine shedding.\n\n### 💡 Restorative Tips:\n- **Iron & B-Complex Boost**: Replenish iron stores with lentils, dark leafy greens, pumpkin seeds, or warm bone broth.\n- **Hydration with Electrolytes**: Add a pinch of Himalayan pink salt and lemon to water to prevent cellular dehydration.\n- **Honor the Dip**: Don't force high-intensity cardio today. Switch to restorative stretching, light walking, or a 20-minute power nap.`;
  }

  // 4. Ovulation / Fertile Window / Conception
  if (q.includes('ovulat') || q.includes('fertile') || q.includes('pregnant') || q.includes('conceiv') || q.includes('bbt') || q.includes('lh')) {
    return `💖 **Ovulation & Fertility Guide (Cycle Day ${day}):**\n\nOvulation is the release of a mature egg from the ovary, typically occurring ~14 days before your next period (around Days 12–16 in a standard 28-day cycle).\n\n### 🔍 3 Key Fertility Biomarkers:\n1. **Cervical Mucus**: Shifts from sticky/dry to clear, slippery, and stretchy (like raw egg whites) during your peak fertile window.\n2. **LH Surge**: An Over-The-Counter LH strip shows two strong dark lines 24–36 hours before the egg releases.\n3. **Basal Body Temperature (BBT)**: Rises by 0.4°F–0.8°F *after* ovulation due to progesterone production.\n\n### 🎯 Timing for Conception:\nSperm can survive up to 5 days in fertile cervical fluid, while the egg survives 12–24 hours. The highest conception probability is during the **2 days before ovulation and the day of ovulation itself**.`;
  }

  // 5. Food / Nutrition / Diet
  if (q.includes('food') || q.includes('diet') || q.includes('eat') || q.includes('nutrition') || q.includes('recipe')) {
    return `🥑 **Phase-Synchronized Nutrition Guide (${phase} Phase):**\n\nEating for your menstrual cycle optimizes hormone clearance and steady energy:\n\n- **Menstrual Phase (Days 1–5)**: Warm, iron-rich, easily digestible meals. Slow-cooked stews, beet juice, bone broth, and dark chocolate (magnesium).\n- **Follicular Phase (Days 6–13)**: Light, fresh, probiotic-rich foods. Kimchi, sauerkraut, sprouted greens, citrus, and lean proteins to support rising estrogen.\n- **Ovulatory Phase (Around Day 14)**: High antioxidant, anti-inflammatory foods. Berries, wild salmon, asparagus, and zinc-rich pumpkin seeds to support egg health.\n- **Luteal Phase (Days 15–28)**: Complex slow-burning carbohydrates to support serotonin. Roasted sweet potatoes, brown rice, magnesium-rich pumpkin seeds, and chamomile tea.`;
  }

  // 6. Ayurveda / CCF / Doshas
  if (q.includes('ayurved') || q.includes('ccf') || q.includes('dosha') || q.includes('vata') || q.includes('pitta') || q.includes('kapha') || q.includes('herb')) {
    return `🌿 **Ayurvedic Wisdom with Vaidya Ananya:**\n\nIn Ayurveda, the menstrual cycle is regulated by the Tridoshas:\n\n- **Apana Vata**: Governs downward elimination (menstrual flow). When aggravated, it causes sharp cramps, constipation, and lower back aches.\n- **Pitta**: Governs hormone transformation and ovulatory heat. When elevated, it causes irritability, acne, and heavy bleeding.\n- **Kapha**: Builds mucosal lining. When stagnant, it causes bloating, breast tenderness, and lethargy.\n\n### ☕ The Famous CCF Tea Recipe:\n- 1/2 tsp Cumin seeds (*Jeera*)\n- 1/2 tsp Coriander seeds (*Dhaniya*)\n- 1/2 tsp Fennel seeds (*Saunf*)\n- Boil in 3 cups of water for 5 minutes, strain, and sip warm throughout the day. It detoxifies *Ama*, eliminates water retention, and calms pelvic cramps!`;
  }

  // 7. PCOS / Irregular Cycles / Acne
  if (q.includes('pcos') || q.includes('pcod') || q.includes('irregular') || q.includes('acne') || q.includes('spearmint') || q.includes('inositol')) {
    return `✨ **PCOS & Hormonal Equilibrium Protocol:**\n\nPolycystic Ovary Syndrome involves an interplay between insulin sensitivity and androgen levels:\n\n### 🔑 Daily Management Protocol:\n1. **Organic Spearmint Tea**: Drinking 2 cups daily has been shown in clinical trials to reduce free testosterone and calm hormonal cystic acne.\n2. **Blood Sugar Pairing Rule**: Never eat a naked carbohydrate. Always pair carbs with protein or healthy fat (e.g., apple + almond butter) to curb insulin spikes.\n3. **Myo-Inositol & D-Chiro Inositol (40:1 ratio)**: Promotes ovulatory regularity and improves cellular insulin responsiveness.\n4. **Low-Impact Movement**: Heavy high-intensity cardio can spike cortisol; swap for strength training, Pilates, and brisk walking.`;
  }

  // 8. Perimenopause / Hot Flashes / Night Sweats
  if (q.includes('menopause') || q.includes('perimenopause') || q.includes('hot flash') || q.includes('sweat') || q.includes('brain fog')) {
    return `🌺 **Perimenopause Comfort & Hormonal Transition:**\n\nPerimenopause (often starting in the 40s) involves erratic estrogen fluctuations before it permanently drops:\n\n### ❄️ Cooling & Balancing Tools:\n- **Hot Flash Relief**: Keep a chilled stainless-steel bottle with infused mint or sage water. Sage has natural cooling properties.\n- **Natural Phytoestrogens**: 1–2 tbsp of freshly ground organic flaxseed, edamame, and lentils gently stimulate estrogen receptors.\n- **Sleep & Brain Fog**: Take **Magnesium Glycinate (300mg)** and 200mg L-Theanine before bed to support deep delta sleep.\n- **Strength & Bone Density**: Progressive resistance training protects bone mineral density as estrogen declines.`;
  }

  // 9. Bloating / Digestion / Water Retention
  if (q.includes('bloat') || q.includes('digest') || q.includes('water') || q.includes('constipat') || q.includes('gas')) {
    return `💧 **Eradicating Hormonal Bloat (Cycle Day ${day}):**\n\nPre-period bloating is driven by **elevated progesterone and aldosterone**, which slows intestinal motility and prompts the kidneys to hold onto water and sodium.\n\n### 🌿 Fast Gut Comfort:\n- **Potassium Power**: Eat potassium-rich foods (bananas, coconut water, avocados) to flush excess cellular sodium.\n- **Fennel & Peppermint Tea**: Relaxes smooth gastrointestinal muscles and relieves trapped gas within 20 minutes.\n- **Ditch Carbonated Beverages & Chewing Gum**: Swallowing extra air exacerbates distended belly feeling.\n- **Warm Water Sips**: Cold iced water shocks digestion (*Agni*); drink body-temperature or warm water.`;
  }

  // 10. Default General Empathetic Health Response
  return `🌸 **Aura AI Wellness Insight (Cycle Day ${day} • ${phase}):**\n\nThank you for sharing your thoughts with me! Your body is constantly communicating through subtle hormonal shifts throughout the ${phase} phase.\n\n### 💡 Key Recommendations for Today:\n- **Listen to Your Rhythm**: If you feel high energy, capitalize on focus and movement; if fatigued, honor your body with quiet rest.\n- **Targeted Nourishment**: Stay hydrated with warm herbal infusions (peppermint, chamomile, or ginger) and emphasize anti-inflammatory whole foods.\n- **Symptom Logging**: Log your symptoms in the Calendar to help our predictive algorithms refine your upcoming cycle forecasts.\n\n*Feel free to ask me anything about your cycle phases, PMS remedies, ovulation timing, or Ayurvedic wellness!*`;
}
