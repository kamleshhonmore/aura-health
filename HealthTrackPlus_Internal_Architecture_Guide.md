# HealthTrack+ for Women: Internal Architecture & Technical Working Guide
**A Technical Reference Guide for Viva, Demonstration, and Project Defense**  
**Author / Presenter Guide** | **Date:** September 2026  

---

## Module 1: The Big Picture – How the Tech Stack Connects

### What TypeScript, React, Capacitor, and Kotlin Do:

1. **TypeScript & React 19 (The User Interface Layer):**
   * **Role:** Manages the entire visual interface (buttons, forms, charts, calendars, navigation, animations).
   * **Location:** `src/` directory (`App.tsx`, `components/`, `utils/`).
   * **How it executes:** Compiles via Vite into clean HTML, CSS, and JavaScript that renders smoothly inside a high-performance web container.

2. **Capacitor (The Bridge Between Web and Native Phone):**
   * **Role:** Wraps the React web app into a real native Android APK (`com.aura.health`).
   * **How it works:** Provides a JavaScript-to-Java/Kotlin bridge. When TypeScript needs hardware features (camera for strip scanning, on-device neural network, back-button listener), Capacitor sends a message across this bridge to native Android code.

3. **Kotlin / Java (The Native Android Layer):**
   * **Role:** Talks directly to the Android operating system and mobile hardware.
   * **Key File:** `android/app/src/main/java/com/aura/health/OnnxPredictorPlugin.java`
   * **What it does:**
     * Loads the raw machine learning model (`pcos_rotterdam_v4.onnx`) directly into the phone's memory.
     * Uses the **Microsoft ONNX Runtime C++ engine** with mobile hardware acceleration.
     * Intercepts Android hardware back-button presses to smoothly close modals before exiting the app.

---

## Module 2: From Button Click to Cloud Database (Step-by-Step)

### Example: User clicks "+250ml Water", logs flow, or saves a symptom.

Here is the exact journey of that data in milliseconds:

```
[User Taps Button] 
       ↓
[React Component Event: onClick]
       ↓
[React State Updates: setLogs(...)]
       ↓
[AuthContext: syncOfflineData]
       ↓
[Database Repository Layer: getDatabaseProvider()]
       ↓
┌───────────────────────┴────────────────────────┐
│                                                │
▼                                                ▼
[Local Repository]                      [Firestore Repository]
- localStorage.setItem(...)             - doc(db, 'users', uid, 'dailyLogs', date)
- Immediate instant UI update          - setDoc(docRef, data, { merge: true })
- 100% offline accessible              - Background cloud sync to Google Cloud
```

### Detailed Breakdown:
* **Step 1 (UI Interaction):** When a user taps a button (e.g. logging a heavy flow or water glass), an `onClick` handler fires in a component like `QuickLogBar.tsx` or `DailyLogModal.tsx`.
* **Step 2 (Local State Update):** React state (`setLogs`) updates immediately so the user experiences zero lag or stutter.
* **Step 3 (Repository Pattern Abstraction):** The app does not hardcode database calls inside UI buttons. Instead, it calls `getDatabaseProvider().saveDailyLog(uid, date, logData)`.
* **Step 4 (Dual Storage):**
  * **Local Storage:** The log is immediately written to phone storage (`localStorage`), ensuring that if the phone loses internet or reboots, the data is never lost.
  * **Google Cloud Firestore:** If connected, Firebase SDK asynchronously transmits the JSON payload to the user's private Firestore sub-collection: `users/{userId}/dailyLogs/{YYYY-MM-DD}`.
  * **Offline Queue:** If the phone is offline, Firebase SDK automatically queues the write in SQLite/IndexedDB and uploads it the second internet returns.

---

## Module 3: How the AI Chatbot Works Internally

### The 3-Tier Multi-Layer Fallback Architecture:

```
[User Types Question: e.g., "Why do I have cramps on Day 14?"]
                              ↓
              [Gathers Real-Time Cycle Context]
         (Current Day, Phase, Symptoms, Cycle Length)
                              ↓
                [Tier 1: OpenRouter API]
          (If custom user API key is provided)
                   /                    \
              [Success]               [Failed / No Key]
                 │                           │
                 ▼                           ▼
          [Return Reply]        [Tier 2: Real-Time Live AI Engine]
                                      (Pollinations API)
                                         /            \
                                    [Success]       [Failed / Offline]
                                       │                    │
                                       ▼                    ▼
                                [Return Reply]   [Tier 3: Client-Side Master Engine]
                                                 (aiMasterEngine.ts heuristics)
```

### Key Technical Details:
1. **Dynamic Prompt Injection:**
   * Before sending the user's message, `GeminiChatbot.tsx` secretly attaches the user's **live biological state**:
     * Current Cycle Day (e.g., Day 14)
     * Cycle Phase (e.g., Ovulatory / Luteal)
     * Symptoms logged today (e.g., mild cramps, headache)
   * This gives the AI "clinical memory" so it doesn't give generic answers.
2. **Layer 1 (OpenRouter):** Calls multiple LLMs (`meta-llama/llama-3.3-70b-instruct`, `deepseek/deepseek-chat`) with automatic failover if configured.
3. **Layer 2 (Live Online Core):** Free real-time fallback ensuring the user always gets a live response without needing an API key.
4. **Layer 3 (Offline Clinical Heuristics):** If the phone is completely disconnected (airplane mode), `src/utils/aiMasterEngine.ts` executes offline keyword pattern matching for over 20 women's health conditions, Rotterdam rules, and Ayurvedic remedies. The chatbot never crashes.

---

## Module 4: How On-Device ML (ONNX) Works on Android

This is your most advanced technical feature. Here is exactly what happens during PCOS screening:

```
[User fills 19 Rotterdam Questions in UI]
                    ↓
[TypeScript builds 19-Element Float32 Array: buildPcosRotterdamVector()]
  - Rule 1: Missing labs set to -1.0
  - Rule 2: Oral contraceptive override (cycle = 28.0d, variance = 0.5)
  - Rule 3: Mutual exclusivity (oligo vs poly vs amenorrhea)
                    ↓
[Capacitor Bridge: OnnxPredictor.runInference({ data: vector })]
                    ↓
[Kotlin / Android Native Plugin: OnnxPredictorPlugin.java]
  - Opens 'assets/pcos_rotterdam_v4.onnx' from APK bundle
  - Wraps input vector into OnnxTensor
  - Calls session.run() using native Microsoft ONNX Runtime C++
                    ↓
[Outputs 5 Phenotype Probabilities]
  - Class 0: Baseline (Non-PCOS)
  - Class 1: Phenotype A (Classic Complete: Androgen + Anovulation + Cysts)
  - Class 2: Phenotype B (Hyperandrogenic Anovulatory)
  - Class 3: Phenotype C (Ovulatory PCOS)
  - Class 4: Phenotype D (Non-Hyperandrogenic)
                    ↓
[Kotlin sends JSON response back over bridge to TypeScript UI in <30ms]
```

### Why This Matters for Viva:
* **No Server Latency:** Prediction takes **under 30 milliseconds**.
* **100% Privacy:** The user's weight, menstrual irregularities, and intimate health data **never leave the mobile device** for AI prediction.

---

## Module 5: How Cycle Calculations & Predictions Work

All menstrual math is calculated deterministically in `src/utils/cycleCalculations.ts`:

1. **Cycle Day Calculation:**
   $$\text{Days Passed} = \frac{\text{Today} - \text{Last Period Start Date}}{86,400,000\text{ ms}}$$
   $$\text{Current Cycle Day} = (\text{Days Passed} \pmod{\text{Cycle Length}}) + 1$$
2. **Ovulation Day Calculation:**
   $$\text{Ovulation Day} = \text{Cycle Length} - \text{Luteal Phase Length (Default 14 days)}$$
   * *Example:* For a 28-day cycle, Ovulation Day $= 28 - 14 = \text{Day 14}$.
3. **Fertile Window Calculation:**
   * Sperm can survive up to 5 days in cervical mucus, and the ovum survives 24 hours.
   * Therefore, the fertile window spans **Ovulation Day $- 5$ days through Ovulation Day $+ 1$ day** (7-day window).
4. **Phase Status Mapping:**
   * Days $1$ to $\text{Period Length}$: **Menstrual Phase** (low conception probability: ~3%).
   * Days $(\text{Period Length} + 1)$ to $(\text{Ovulation} - 6)$: **Follicular Phase** (low: ~8%).
   * Days $(\text{Ovulation} - 5)$ to $(\text{Ovulation} + 1)$: **Fertile Window** (medium to high: 18%–28%).
   * Ovulation Day: **Peak Fertility** (~33%).
   * Post-Ovulation to Cycle End: **Luteal Phase** (low: ~4%).

---

## Module 6: How the Doctor Portal Connects to Patient Data

### The End-to-End Data Pipeline:

```
[Patient Mobile App]
  - Logs 3-6 cycles of symptoms, BBT, flow
  - Runs Rotterdam v4 On-Device Assessment
  - Generates standardized JSON / PDF report
  - Syncs to Firestore: users/{patientUid}/medicalSummary
                         ↓
             [Google Cloud Firestore]
      (Secured with Firebase Security Rules)
                         ↓
[Doctor Web Portal (Clinician Dashboard)]
  - Doctor logs in with verified clinician credentials
  - Enters patient ID or opens assigned patient roster
  - Fetches:
      1. Longitudinal cycle regularity chart
      2. Basal body temperature biphasic shifts
      3. Rotterdam Phenotype risk breakdown (A, B, C, D)
      4. Symptom frequency heatmap
  - Doctor submits digital consultation note & lifestyle Rx
                         ↓
[Firebase Realtime Listener / Push Notification]
  - Patient app instantly receives doctor's advice & prescription
```

---

## Module 7: Quick Viva "Cheat Sheet" (Top 5 Questions & Answers)

### Q1: "Explain the architecture of your mobile app."
> **Answer:** *"Our app uses a decoupled client-server and edge hybrid architecture. The frontend is built with React 19, TypeScript, and Tailwind CSS, wrapped into an Android APK using Capacitor. Heavy biometric AI inference is executed on-device via ONNX Runtime using a native Kotlin plugin. Cloud synchronization and authentication are handled asynchronously by Google Cloud Firestore."*

### Q2: "What is the role of Kotlin in your project if you wrote the UI in TypeScript?"
> **Answer:** *"TypeScript handles the UI and user state. Kotlin acts as the bridge to native Android hardware. Specifically, Kotlin loads our compiled `pcos_rotterdam_v4.onnx` neural model into memory, creates native tensor buffers, and runs hardware-accelerated inference via the ONNX Runtime library, passing the diagnostic probabilities back to TypeScript."*

### Q3: "How do you handle patient data privacy?"
> **Answer:** *"We follow privacy-by-design principles:
> 1. AI screening runs 100% on-device (zero sensitive data sent over the internet for prediction).
> 2. The app includes a client-side 4-digit PIN lock with local storage encryption.
> 3. Cloud backups in Firestore are strictly isolated using user UID security rules."*

### Q4: "What happens if a user is in an area with no internet?"
> **Answer:** *"The app is offline-first. We built an Abstract Repository Pattern with dual data providers. When offline, all cycle math, symptom logs, water tracking, and ONNX AI screening execute against local storage. Once network connection is restored, the Firebase context synchronizes all cached logs to the cloud."*

### Q5: "How does the Doctor Portal interact with the Patient App?"
> **Answer:** *"Patients can export or sync their multi-cycle diagnostic summaries to Firestore. Licensed doctors log in to the responsive Web Doctor Portal to review patient histories, inspect their Rotterdam Phenotype classification, review BBT curves, and issue digital consultation advice back to the patient."*
