# HealthTrack+ for Women - Project Presentation (PPT) Correction & Modification Guide
**Department of Computer / Information Technology Engineering**  
**Project:** HealthTrack+ for Women (AI-Powered Menstrual Health, Rotterdam PCOS Diagnostics & Doctor Portal)  
**Date:** September 2026  

---

## 📌 Note on App Name
> **The name of your project remains unchanged as:**  
> **"HealthTrack+ for Women"** (as already used across your title and slides).  
> All recommendations below focus strictly on correcting the **technical inaccuracies, architecture, database, ML deployment, and Doctor Portal details** in your presentation slides.

---

## 🚨 The 3 Critical Technical Inaccuracies in Your PPT (Must Fix)

These are the technical points currently in your slides that conflict with real code and will trigger examiner questions during your viva:

| # | Slide & Section | What Your PPT Incorrectly Says | Exact Correct Technical Info to Put | Why This Must Be Changed |
|---|---|---|---|---|
| **1** | **Slide 20 & 21: Frontend Framework** | **React Native (Expo)**, React Navigation, NativeWind | **React 19, TypeScript, Vite, Tailwind CSS, Capacitor (Android Native Wrapper with Kotlin)** | The project does **not** use React Native or Expo. It is built using **React 19 + Vite** packaged as an Android APK via **Capacitor** with custom Kotlin plugins. Mentioning Expo will cause problems if examiners ask to see `App.json` or Expo configs. |
| **2** | **Slide 20 & 21: Database** | **MySQL**, Firebase | **Google Cloud Firestore (NoSQL) with Offline Cache & Abstract Repository Pattern** | There is **no MySQL** relational database in the project. If you list MySQL, examiners will ask about SQL schemas, tables, normalization, and foreign keys. Stating **Google Cloud Firestore** matches your real database setup. |
| **3** | **Slide 8, 9, 20: Machine Learning** | Cloud Python API (`FastAPI, Scikit-learn`) | **On-Device Edge ML via ONNX Runtime (`pcos_rotterdam_v4.onnx`) + Kotlin Plugin** | Having the AI model run **directly on the Android device** using ONNX Runtime is a huge technical accomplishment. It guarantees **zero network latency** and **100% patient biometric data privacy**. Mentioning a cloud Python server hides your best technical achievement! |
| **4** | **Slide 8 & 20: Authentication** | **JWT Authentication** | **Firebase Authentication (Google OAuth + Email/Password + Anonymous/Guest)** | The project uses Firebase Auth with Role-Based Access Control (RBAC), not custom backend JWT token signing. |

---

## 🩺 Doctor Portal Website: How to Present It in Your PPT

You already have the **Doctor Portal Website** in your project scope. Here is the exact, proper way to describe it across your slides so examiners clearly understand your dual-portal ecosystem:

### 1. Dual-Platform Ecosystem (Concept)
* **Patient Mobile App (HealthTrack+ Android App):** Designed for individual women to log daily cycles, symptoms, moods, BBT (basal body temperature), water, and self-screening.
* **Doctor Portal (HealthTrack+ Web Portal):** A dedicated, responsive web dashboard designed for licensed gynecologists, reproductive endocrinologists, and clinicians.

### 2. Key Doctor Portal Modules to Feature in the PPT:
* **Doctor Authentication & Credential Verification:** Secure clinician login with Role-Based Access Control (RBAC).
* **Patient Medical History Stream:** Real-time access to patient consent-shared cycle histories, flow variations, and symptom frequency trends over 3–6 months.
* **Rotterdam Diagnostic Phenotype Breakdown:**
  * Displays the patient's predicted Rotterdam class:
    * **Phenotype A:** Classic Complete (High androgens + anovulation + polycystic ovaries)
    * **Phenotype B:** Hyperandrogenic Anovulatory (High androgens + irregular cycles)
    * **Phenotype C:** Ovulatory PCOS (High androgens + cysts, regular cycles)
    * **Phenotype D:** Non-Hyperandrogenic (Irregular cycles + cysts, normal androgens)
  * Displays model confidence score (%) and biometric indicators (WHR, BMI, mFG score, androgenic signs).
* **Standardized Clinical PDF Report Ingestion:** Reviewing the clinical summary PDF report exported directly by the patient app for clinic visits or tele-health consultations.
* **Digital Consultation Notes & Lifestyle Guidance:** Doctors can issue advice (nutrition, seed cycling, supplements like Myo-inositol) and schedule follow-up appointments.

---

## 📑 Slide-by-Slide Exact Corrections (Ready to Copy-Paste into PowerPoint)

---

### Slide 3: Introduction
* **Current Text:** General intro on period tracking and PCOS awareness.
* **Change To / Add:**
  > "HealthTrack+ for Women is an integrated healthcare ecosystem combining an on-device Android tracking app, edge AI screening for PCOS using the international Rotterdam Consensus Criteria, and a dedicated Web Doctor Portal that connects patients directly with licensed clinicians for collaborative care."
* **Add 3 Key Feature Bullets:**
  * **Dual Ecosystem:** Patient Mobile App (Capacitor/React) + Doctor Web Dashboard.
  * **Privacy-First Edge ML:** On-device ONNX Runtime PCOS screening with zero server latency.
  * **Clinical Continuity:** Multi-cycle standardized PDF report generation and doctor review portal.

---

### Slide 5: Research Gap
* **Gap 1 (Over-reliance on Imaging):**
  * *Update:* "Conventional diagnosis relies heavily on costly pelvic ultrasound and invasive blood panels. HealthTrack+ introduces non-invasive pre-clinical risk stratification based on 19 Rotterdam biomarkers."
* **Gap 3 (Lack of Unified Doctor-Patient Ecosystem):**
  * *Update:* "Most commercial apps operate in silos with no clinician connection. HealthTrack+ bridges this divide through a synchronized Doctor Web Portal for clinical evaluation and prescription notes."

---

### Slide 8: Methodology of Proposed System
* **Update the Following Points:**
  * **Point 2 (Authentication):** "Implement secure multi-role authentication (Patients & Doctors) using **Firebase Authentication** and Role-Based Access Control (RBAC)."
  * **Point 4 (Machine Learning):** "Deploy **On-Device Edge ML via ONNX Runtime** evaluating 19 Rotterdam criteria biomarkers to stratify PCOS risk into Phenotypes A, B, C, and D without sending raw patient data to external servers."
  * **Point 5 (Database):** "Persist health data using **Google Cloud Firestore (NoSQL)** with offline caching and an Abstract Repository Pattern (Firestore / LocalStorage)."
  * **Point 6 (Doctor Portal):** "Provide a **Doctor Portal Website** enabling physicians to review patient cycle history, analyze Rotterdam diagnostic scores, and issue digital consultation notes."

---

### Slide 9: Proposed System Architecture Diagram
Update the boxes in your diagram:
1. **Patient Mobile App Box:**
   * Label: *"Mobile Application (React 19 + Vite + Capacitor Android)"*
   * Add sub-badge: *"ONNX Runtime Engine (On-Device Inference)"*
2. **Doctor Portal Box:**
   * Label: *"Doctor Portal (Responsive React Web Dashboard)"*
   * Sub-items: *"Patient Profile Review, Rotterdam Phenotype Analyzer, Consultation Notes, Appointment Manager"*
3. **API & Cloud Backend Box:**
   * Label: *"Node.js / Express REST API Server + Firebase Auth"*
4. **Database Box:**
   * Change from `MySQL` to: *"Google Cloud Firestore (NoSQL) with Offline Cache + Local Storage"*

---

### Slide 10: Dataset & 19-Feature Schema
* **Datasets Used:** Kaggle PCOS Clinical Dataset, Menstrual Health & Productivity Dataset, Natural Family Planning Dataset, Global PCOS Prevalence Data.
* **Add the 19 Rotterdam Model Inputs (Demonstrates strong domain knowledge):**
  1. *Anthropometric:* Age, Years Post-Menarche, BMI, Waist-to-Hip Ratio (WHR).
  2. *Cycle Dynamics:* Mean Cycle Length, Cycle Variance (STD), Oligomenorrhea (>35d), Polymenorrhea (<21d), Amenorrhea (>90d).
  3. *Hyperandrogenic & Skin Signs:* Modified Ferriman-Gallwey (mFG) Score (0–36), Hormonal Acne, Androgenic Alopecia, Acanthosis Nigricans.
  4. *Medication Overrides:* Oral Contraceptive active status (forces 28.0d baseline to avoid masking), Insulin Sensitizers (Metformin).
  5. *Optional Clinical Labs:* LH/FSH Ratio, Total Testosterone, Fasting Insulin, TSH (with `-1.0` handling for unentered home tests).

---

### Slide 13: Software Requirements Specification (SRS)
* **Functional Requirements (Update to Include):**
  * Multi-Role User Management (Patient vs. Doctor login).
  * Menstrual Tracking & Biphasic Basal Body Temperature (BBT) plotting.
  * On-Device Rotterdam v4 PCOS Diagnostic Screening (Phenotypes A–D).
  * Doctor Portal Patient Timeline Review & Consultation Notes.
  * Standardized Clinical Medical Report (PDF Export).
* **Non-Functional Requirements (Update to Include):**
  * **Privacy & Security:** On-device ML execution ensures private biometric data never leaves the patient's phone for prediction.
  * **Offline Resilience:** App functions completely offline via LocalStorage repository when internet is unavailable.
  * **Speed / Latency:** Sub-30ms model inference via native hardware-accelerated ONNX Runtime.

---

### Slide 14: Use Case Diagram
Ensure both primary actors and their use cases are represented:
* **Patient Actor (Left):**
  * *Register & Login*
  * *Log Daily Flow, Symptoms & Vitals*
  * *Run Rotterdam AI Screening*
  * *Generate Clinical PDF Report*
  * *Request Doctor Consultation*
* **Doctor Actor (Right):**
  * *Login to Doctor Web Portal*
  * *Access Assigned Patient Profiles*
  * *Review Rotterdam Phenotype Breakdown & Biomarkers*
  * *Issue Digital Consultation Notes & Lifestyle Guidance*
  * *Manage Patient Appointments*

---

### Slide 15–17: DFDs (Level 0, 1, and 2)
* **Level 0 (Context Diagram):**
  * Patient $\leftrightarrow$ Symptoms / Logs $\leftrightarrow$ **HealthTrack+ System** $\leftrightarrow$ Cycle Predictions / Insights.
  * Doctor $\leftrightarrow$ Physician Credentials $\leftrightarrow$ **HealthTrack+ System** $\leftrightarrow$ Patient Histories & Phenotypes.
  * Doctor $\rightarrow$ Consultation Notes $\rightarrow$ **HealthTrack+ System** $\rightarrow$ Patient.
* **Level 1 & 2 DFDs:**
  * Update database data store labels from `MySQL DB` to **`Firestore Database / Local Storage`**.
  * Add the ML inference flow: `Patient Biometric Vector` $\rightarrow$ `On-Device ONNX Predictor` $\rightarrow$ `Rotterdam Risk Classification`.

---

### Slide 20: Frameworks Used (Replace Entire Slide Table With This)

| Category | Framework / Technology Used |
|---|---|
| **Mobile Frontend (Patient App)** | React 19, TypeScript, Vite, Tailwind CSS, Capacitor (Android Native Wrapper with Kotlin), Motion, Lucide Icons |
| **Web Frontend (Doctor Portal)** | React.js, Responsive Web Dashboard, Tailwind CSS, Lucide React Icons |
| **Backend Services & API** | Node.js, Express.js REST API, Master AI Health Engine |
| **Machine Learning / AI** | ONNX Runtime (Mobile Android Inference via Kotlin Plugin), Rotterdam v4 Decision Forest, Google GenAI SDK |
| **Database & Cloud Storage** | Google Cloud Firestore (NoSQL, Offline Persistence), Abstract Repository Pattern (Firestore / LocalStorage) |
| **Authentication & Security** | Firebase Authentication (Google OAuth + Email/Password + Anonymous/Guest), Client-Side PIN Encryption |
| **Development & Testing Tools** | Android Studio, VS Code, Gradle 8.9, Vite 6, Vitest / Node.js test runner, Git & GitHub |

---

### Slide 21: Design Details
* **Architecture:**
  * *Update to:* **"Decoupled Client-Server & Edge Hybrid Architecture"**:
    * The patient mobile app uses **React 19 + Capacitor** for a smooth native mobile experience.
    * The doctor portal uses a **responsive React Web Dashboard** optimized for desktop clinical consultations.
    * Heavy biometric diagnostic screening runs **On-Device via ONNX Runtime** for absolute privacy.
* **Database & Storage:**
  * *Update to:* **"Google Cloud Firestore with Abstract Repository Pattern"**:
    * Allows seamless switching between cloud storage and on-device offline storage without modifying UI code.
* **Security:**
  * *Update to:* **"Role-Based Access Control (RBAC), Firebase Security Rules, and Client-Side 4-Digit PIN Lock"**.

---

### Slide 22: Conclusion
* **Update Text to:**
  > "HealthTrack+ for Women successfully delivers a comprehensive, privacy-first healthcare platform. By combining on-device Rotterdam v4 machine learning with an authenticated Doctor Web Portal, the system bridges the gap between daily self-care and professional clinical diagnosis, empowering women and doctors with actionable, longitudinal health data."

---

## 🎯 Top 4 Viva Questions & Exact Winning Answers

### Q1: "Why did you build both a Mobile App and a Doctor Web Portal?"
> **Answer:** *"Patients need a private, convenient mobile app to log daily symptoms, temperature, and cycle changes anytime. On the other hand, doctors need a desktop-friendly web dashboard with widescreen data visualization, multi-cycle trend charts, and clinical PDF reviews to evaluate patients during clinical consultations without looking at a phone screen."*

### Q2: "Why use ONNX Runtime on the phone instead of calling a Python server?"
> **Answer:** *"Menstrual and reproductive health data is highly personal and sensitive under HIPAA and data privacy principles. Transmitting raw symptoms to a remote server creates security risks and requires a constant internet connection. By compiling our trained Rotterdam model to ONNX format and loading it directly in Android using our custom Kotlin plugin (`OnnxPredictorPlugin`), inference runs in under 30 milliseconds completely offline."*

### Q3: "What makes your PCOS screening different from basic period trackers?"
> **Answer:** *"Most trackers only make binary guesses based on missed days. HealthTrack+ implements the international 2003/2018 Rotterdam Consensus Guidelines, evaluating 19 parameters including hyperandrogenism (mFG hirsutism, cystic acne, alopecia) and medication masking overrides for birth control, classifying patients into Phenotypes A, B, C, or D."*

### Q4: "What happens if a patient has no internet connection?"
> **Answer:** *"Our architecture implements an Abstract Repository Pattern with dual database providers. All cycle calculations, symptom logs, PIN security, and ONNX AI predictions function 100% offline using local storage. When connectivity resumes, the Firebase Auth context automatically synchronizes records to Google Cloud Firestore."*
