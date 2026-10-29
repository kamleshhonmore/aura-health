/**
 * Client-Side Master Aura Intelligence Engine
 * Provides intelligent, phase-aware, context-rich responses when offline
 * or when running inside native Android/iOS without an active backend connection.
 */

export interface CycleContext {
  cycleDay?: number | string;
  phase?: string;
  daysUntilPeriod?: number | string;
  symptoms?: string;
  moods?: string;
}

export function generateClientMasterAuraResponse(query: string, cycleContext?: CycleContext): string {
  const q = (query || '').trim().toLowerCase();
  const phase = cycleContext?.phase || 'Luteal';
  const cycleDay = cycleContext?.cycleDay || '14';
  const symptoms = cycleContext?.symptoms || 'None reported today';

  // 1. Greetings
  if (/^(hi|hello|hey|hola|namaste|good\s*(morning|afternoon|evening))\b/i.test(q) || q === 'hi' || q === 'hello' || q === 'hey') {
    return `Hello, beautiful! 🌸 I am **Aura AI**, your all-in-one Master Women's Health & App Intelligence.

Today you are on **Cycle Day ${cycleDay} • ${phase} Phase**.

I can help you with anything:
• **Cycle & Symptoms**: Decode cramps, mood shifts, and hormonal patterns.
• **App Guidance**: Learn how to log symptoms, set your secret PIN lock, change themes, or export doctor reports.
• **Clinical Diagnostics**: Understand markers for PCOS, Endometriosis, and fertility windows.
• **Ayurveda & Remedies**: Natural CCF teas, castor oil packs, and seed cycling.

What would you like to explore or do today?`;
  }

  // 2. PIN Lock / Security
  if (q.includes('pin') || q.includes('lock') || q.includes('secret') || q.includes('password') || q.includes('privacy')) {
    return `🔒 **How to Set Up Keep It Secret PIN Lock:**

1. Tap the **Settings (⚙️)** icon in the top header.
2. Under **Privacy & Security**, toggle **Enable PIN Lock**.
3. Enter your preferred **4-digit security PIN** and confirm it.
4. Once enabled, the app will require your PIN whenever you re-open it, keeping your cycle, intimacy, and health logs 100% private!`;
  }

  // 3. How to Log Symptoms & Period
  if (q.includes('how to log') || q.includes('log period') || q.includes('record') || q.includes('add log') || q.includes('daily log') || q.includes('period started')) {
    return `📝 **How to Log Your Period & Daily Symptoms:**

1. **Quick Toggle**: On the Home screen, tap the big **"Period Started"** button to log period flow instantly.
2. **Detailed Logging**: Tap **"Log Symptoms"** or tap any date on the **Calendar** tab.
3. **Track Everything**:
   • **Flow level**: Spotting, Light, Medium, Heavy
   • **Physical Symptoms**: Cramps, bloating, headache, tender breasts, acne
   • **Moods**: Happy, irritable, anxious, calm, fatigued
   • **Vitals & Intimacy**: Basal body temperature, weight, cervical mucus
4. Tap **Save**—your inputs are immediately saved locally and synced to your cloud account!`;
  }

  // 4. Themes & Mascot Companions
  if (q.includes('theme') || q.includes('color') || q.includes('pet') || q.includes('mascot')) {
    return `🎨 **Customizing Themes & Pet Companions:**

1. **Themes**: Tap the **Palette icon (🎨)** in the top header. Choose from:
   • 🌸 **Blossom Pink** (Classic feminine aesthetic)
   • 💜 **Lavender Dream** (Soothing gentle violet)
   • 🌿 **Earthy Mint** (Calming natural sage green)
   • 🌅 **Sunset Coral** (Warm energizing amber & rose)
2. **Pet Mascots**: Choose your diary companion (Kitty 🐱, Bunny 🐰, Puppy 🐶, Teddy 🧸, or Flora 🌸). Your pet will react to your cycle phases with encouraging daily messages!`;
  }

  // 5. Water & Pill Tracking
  if (q.includes('water') || q.includes('pill') || q.includes('hydration') || q.includes('medicine')) {
    return `💧 **Tracking Water & Daily Pills:**

• **Water Tracker**: On the Home screen, tap the **"+ Add 250 ml Cup"** button. Your default goal is 8 glasses (2,000 ml) per day.
• **Contraceptive / Vitamin Pill**: Tap **"Take Daily Pill"** on the Home tab to check off your daily dose. You can also customize your reminder notification time in **Reminders ⏰**!`;
  }

  // 6. Medical Doctor Report (PDF)
  if (q.includes('report') || q.includes('pdf') || q.includes('doctor') || q.includes('export') || q.includes('obgyn')) {
    return `📋 **Generating a Medical Doctor Report (PDF):**

1. Tap the **Hub (Category)** tab at the bottom navigation dock.
2. Select **Clinical Diagnostics & Doctor Report**.
3. Tap **Generate Clinical Summary (PDF)**.
4. The app compiles your cycles, symptom frequencies, cycle irregularities, and vitals into a standardized clinical PDF report ready to print or email to your gynecologist!`;
  }

  // 7. Cramps & Pain Relief
  if (q.includes('cramp') || q.includes('pain') || q.includes('dysmenorrhea') || q.includes('ache')) {
    return `🌸 **Relief for Cramps & Pelvic Tension (Cycle Day ${cycleDay} • ${phase} Phase):**

Premenstrual and menstrual cramps are triggered by uterine muscle contractions from prostaglandins. Here is your quick soothing protocol:

1. **Heat Therapy**: Apply a heating pad or warm castor oil compress across your lower abdomen for 15-20 minutes to relax myometrial tension.
2. **Ayurvedic Herbal Infusion**: Steep freshly grated ginger, 1/2 tsp cumin, and 1/2 tsp fennel seeds in boiling water. Drink warm with raw honey.
3. **Magnesium Glycinate**: 300-400mg daily eases muscle spasming and nervous tension.
4. **Gentle Movement**: Supta Baddha Konasana (Reclined Butterfly) or Child's Pose with wide knees eases pelvic blood flow.`;
  }

  // 8. PCOS (Polycystic Ovary Syndrome)
  if (q.includes('pcos') || q.includes('polycystic') || q.includes('rotterdam') || q.includes('androgen') || q.includes('hirsutism')) {
    return `🩺 **Clinical Insights on PCOS (Polycystic Ovary Syndrome):**

• **Rotterdam Diagnostic Criteria** requires at least 2 of 3 features:
  1. Irregular, delayed, or absent periods (cycles > 35 days).
  2. Clinical or biochemical hyperandrogenism (excess facial/body hair, hormonal acne, elevated free testosterone).
  3. Polycystic ovaries visible on pelvic ultrasound.
• **Root Drivers**: Often driven by underlying insulin resistance and chronic low-grade inflammation.
• **Evidence-Based Action Plan**:
  - **Nutrition**: Pair carbohydrates with fiber and protein (chia seeds, avocado, lentils) to stabilize insulin spikes.
  - **Herbal Therapy**: Organic **spearmint tea** (1-2 cups daily) has documented anti-androgen benefits.
  - **Supplements**: Myo-inositol & D-chiro-inositol (40:1 ratio) and Magnesium glycinate.
  - **App Tool**: You can take our clinical screening assessment in the **Diagnostics Hub** tab to evaluate your risk markers!`;
  }

  // 9. Endometriosis
  if (q.includes('endo') || q.includes('endometriosis')) {
    return `🩺 **Clinical Insights on Endometriosis:**

• **Core Characteristics**: Endometrial-like tissue grows outside the uterus, causing cyclic inflammation, severe pelvic pain, deep dyspareunia, and GI disturbances.
• **When to consult an OBGYN**: Pain that doesn't respond to standard NSAIDs, pain during bowel movements, or radiating pain down your thighs.
• **Supportive Habits**: Anti-inflammatory diet (curcumin, omega-3 fatty acids), pelvic floor physical therapy, and tracking pain intensity in your app logs.`;
  }

  // 10. Fertile Window & Ovulation
  if (q.includes('fertile') || q.includes('ovulat') || q.includes('conception') || q.includes('pregnant') || q.includes('pregnancy')) {
    return `💖 **Fertility & Ovulation Insights:**

• **The Fertile Window**: Spans approximately 6 days—the 5 days leading up to ovulation plus ovulation day itself (sperm can survive up to 5 days in fertile cervical fluid).
• **Ovulation Signs**:
  - **Cervical Mucus**: Egg-white, clear, stretchy mucus (estrogenic peak).
  - **Basal Body Temperature (BBT)**: A slight dip followed by a sustained 0.3°C - 0.5°C rise caused by progesterone.
  - **Mittelschmerz**: Mild one-sided lower abdominal twinge.
• Today you are on **Day ${cycleDay} (${phase} Phase)**. You can track BBT and cervical fluid directly in the **Calendar** tab!`;
  }

  // 11. Ayurvedic CCF Tea & Detox
  if (q.includes('tea') || q.includes('ccf') || q.includes('ayurved') || q.includes('remedy') || q.includes('bloat')) {
    return `🌿 **Ayurvedic CCF (Cumin, Coriander, Fennel) Digestive Tea:**

CCF tea is an ancient balancing formulation ideal for all cycle phases:

• **Ingredients**:
  - 1/3 tsp whole Cumin seeds (Kindles digestive fire / Agni)
  - 1/3 tsp whole Coriander seeds (Cools inflammation and Pitta)
  - 1/3 tsp whole Fennel seeds (Relieves gas, bloating, and uterine cramps)
• **Instructions**:
  1. Boil seeds in 3 cups of water for 5-7 minutes.
  2. Strain and sip warm throughout the day.
  3. Enjoy after meals to banish bloating and soothe water retention!`;
  }

  // 12. Nutrition & Food
  if (q.includes('food') || q.includes('diet') || q.includes('eat') || q.includes('nutrition') || q.includes('craving')) {
    return `🥗 **Phase-Based Nutrition for Cycle Day ${cycleDay} (${phase} Phase):**

• **Luteal Phase**: Progesterone increases resting metabolism. Opt for complex carbs (sweet potatoes, oats), magnesium-rich dark chocolate (70%+), pumpkin seeds, and warm stews.
• **Menstrual Phase**: Replenish iron and zinc with bone broth, lentils, beets, dark leafy greens, and warm CCF tea.
• **Follicular Phase**: Light, fresh foods like salads, fermented kimchi/kefir, and flax seeds.
• **Ovulatory Phase**: Fiber-rich veggies to help the liver metabolize peak estrogen (broccoli, Brussels sprouts, raspberries).`;
  }

  // General Context-Aware Fallback
  return `🌸 **Aura AI Master Insight (Cycle Day ${cycleDay} • ${phase} Phase):**

I am right here with you! Based on your current **${phase} Phase** (Symptoms: ${symptoms}):

• **Body & Hormones**: Your body is in a key transitional rhythm. Give yourself permission to prioritize rest and hydration.
• **Holistic Tip**: Drink warm chamomile or ginger tea, take a 15-minute gentle walk, and avoid excessive iced drinks.
• **App Quick-Action**: You can tap any date on the **Calendar** to update symptoms, or tap **Settings (⚙️)** for privacy PIN controls.

Feel free to ask about cramps, diet, fertility, PCOS, or anything else you'd like to explore!`;
}
