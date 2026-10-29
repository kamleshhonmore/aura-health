const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generatePDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  let y = margin;

  function checkPageBreak(neededHeight) {
    if (y + neededHeight > pageHeight - margin - 30) {
      addFooter();
      doc.addPage();
      y = margin + 10;
      addHeader();
    }
  }

  function addHeader() {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('HealthTrack+ for Women • Project Presentation (PPT) Technical Correction Guide', margin, 25);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 28, pageWidth - margin, 28);
  }

  function addFooter() {
    const pageNum = doc.internal.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
    doc.text('Terna Engineering College • Department of Computer / IT Engineering', margin, pageHeight - 15);
  }

  // --- COVER BANNER ---
  doc.setFillColor(239, 68, 68); // Rose red
  doc.roundedRect(margin, y, contentWidth, 75, 8, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('HEALTHTRACK+ FOR WOMEN', margin + 15, y + 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(254, 226, 226);
  doc.text('Project Presentation (PPT) Technical Audit & Slide Correction Guide', margin + 15, y + 46);

  doc.setFontSize(9);
  doc.text('AI-Powered Menstrual Health, Rotterdam v4 Diagnostics & Web Doctor Portal Ecosystem', margin + 15, y + 62);

  y += 90;

  // --- NOTE ON APP NAME ---
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 34, 6, 6, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Project Name Note:', margin + 8, y + 13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('The project name remains unchanged as "HealthTrack+ for Women" throughout all presentation slides.', margin + 8, y + 25);
  y += 44;

  // --- SECTION: CRITICAL TECHNICAL RED FLAGS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(190, 18, 60);
  doc.text('1. Top Technical Inaccuracies to Fix in PPT (Examiner Red Flags)', margin, y);
  y += 18;

  const redFlags = [
    {
      title: 'A. Frontend Framework (Slide 20, 21): React Native / Expo -> React 19 + Capacitor',
      desc: 'PPT states "React Native (Expo)". The codebase is built with React 19, TypeScript, Vite, Tailwind CSS, and Capacitor (with native Android Kotlin plugin). If examiners look at your package.json, there is no Expo runtime. Change all references to "React 19 with Vite & Capacitor Native Android".',
    },
    {
      title: 'B. Database Engine (Slide 20, 21): MySQL -> Google Cloud Firestore + Local Cache',
      desc: 'PPT lists "MySQL, Firebase". Your project exclusively uses Google Cloud Firestore (NoSQL) with offline caching and an Abstract Repository Pattern (Firestore / LocalStorage). Mentioning MySQL invites questions about SQL tables and schemas that do not exist.',
    },
    {
      title: 'C. ML Inference (Slide 8, 9, 20): Cloud Python API -> On-Device Edge ONNX Model',
      desc: 'PPT suggests a remote Python FastAPI server. In reality, you have implemented on-device ONNX Runtime (pcos_rotterdam_v4.onnx) running directly on Android via OnnxPredictorPlugin.java. On-device inference guarantees zero network latency and 100% patient data privacy. Emphasize this!',
    },
    {
      title: 'D. Authentication Protocol (Slide 8, 20): JWT -> Firebase Auth + RBAC',
      desc: 'PPT lists "JWT Authentication". The app uses Firebase Authentication (Google OAuth, Email/Password, Anonymous Guest Mode) coupled with Role-Based Access Control (RBAC) and Firestore security rules.',
    },
  ];

  redFlags.forEach((flag) => {
    checkPageBreak(55);
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, y, contentWidth, 48, 6, 6, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(159, 18, 57);
    doc.text(flag.title, margin + 8, y + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(flag.desc, contentWidth - 16);
    doc.text(splitDesc, margin + 8, y + 26);

    y += 54;
  });

  // --- SECTION: DOCTOR PORTAL WEBSITE ---
  checkPageBreak(120);
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text('2. Doctor Portal Website: How to Accurately Present It in PPT', margin, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const docPortalText =
    'Your system features a dual-platform ecosystem: the Patient Mobile App and the Doctor Web Portal. In your presentation, highlight these 5 core Doctor Portal capabilities:';
  doc.text(docPortalText, margin, y);
  y += 16;

  const doctorPoints = [
    {
      head: '1. Verified Clinician Authentication:',
      body: 'Role-Based Access Control (RBAC) ensuring only credentialed physicians can review patient medical records.',
    },
    {
      head: '2. Patient Health Record Stream:',
      body: 'Real-time visibility into consented patient cycle histories, flow intensity, and basal body temperature biphasic curves.',
    },
    {
      head: '3. Rotterdam Phenotype Diagnostic Viewer:',
      body: 'Displays AI-classified Rotterdam Phenotype (A, B, C, or D), model confidence percentage, and 19 biomarker attributions (WHR, mFG score, androgenic signs).',
    },
    {
      head: '4. Standardized Clinical PDF Report Ingestion:',
      body: 'Seamless ingestion and review of the multi-cycle clinical summary PDF generated by the patient application.',
    },
    {
      head: '5. Digital Consultation Notes & Lifestyle Rx:',
      body: 'Enables clinicians to issue dietary plans, seed cycling guidance, and medical follow-up advice directly to the patient dashboard.',
    },
  ];

  doctorPoints.forEach((p) => {
    checkPageBreak(28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${p.head} `, margin + 10, y);
    const headWidth = doc.getTextWidth(`• ${p.head} `);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitBody = doc.splitTextToSize(p.body, contentWidth - headWidth - 15);
    doc.text(splitBody, margin + 10 + headWidth, y);
    y += Math.max(16, splitBody.length * 11 + 5);
  });

  // --- SECTION: SLIDE BY SLIDE ROADMAP ---
  checkPageBreak(120);
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text('3. Slide-by-Slide Exact Action Items (Copy-Paste Ready)', margin, y);
  y += 18;

  const slideUpdates = [
    {
      slide: 'Slide 3: Introduction',
      action: 'Emphasize the dual-portal ecosystem: "HealthTrack+ for Women integrates an on-device Android tracking app, edge AI Rotterdam PCOS screening, and a dedicated Web Doctor Portal for physician collaboration."',
    },
    {
      slide: 'Slide 5: Research Gap',
      action: 'Emphasize that existing apps lack a clinician bridge. HealthTrack+ closes this gap by allowing patients to share multi-cycle diagnostic reports directly with clinicians via the Doctor Portal.',
    },
    {
      slide: 'Slide 8: Methodology',
      action: 'Update Step 2 to "Multi-Role RBAC (Patients & Doctors) via Firebase Auth", Step 4 to "On-Device ONNX Machine Learning Inference with 19 biomarkers", and Step 5 to "Google Cloud Firestore (NoSQL)".',
    },
    {
      slide: 'Slide 9: Proposed System Architecture',
      action: 'In Mobile box: "ONNX Runtime Engine (On-Device Inference)". In Doctor Portal box: "Patient Records, Phenotype Analysis, Prescriptions". In Database: replace MySQL with "Cloud Firestore".',
    },
    {
      slide: 'Slide 10: Dataset & Feature Schema',
      action: 'Add the 19 Rotterdam features: Age, Menarche Age, BMI, Waist-to-Hip Ratio (WHR), Mean Cycle, Variance, mFG Hirsutism (0-36), Acne, Alopecia, Acanthosis, Birth Control override, and 4 Lab parameters.',
    },
    {
      slide: 'Slide 13: SRS Requirements',
      action: 'Under Functional: add "Doctor Portal Access & Consultation Notes". Under Non-Functional: emphasize "Edge ML Privacy" and "Offline-First LocalStorage Fallback".',
    },
    {
      slide: 'Slide 14-17: Use Case & DFDs',
      action: 'Ensure the Doctor actor connects to: "Log in to Doctor Portal", "View Patient Profile & Rotterdam Diagnosis", "Issue Digital Prescription / Notes", and "Manage Appointments".',
    },
    {
      slide: 'Slide 20: Frameworks & Tech Stack',
      action: 'Replace React Native/Expo with: React 19, TypeScript, Vite, Tailwind CSS, Capacitor (Android Native Kotlin Plugin). Replace MySQL with: Google Cloud Firestore (NoSQL).',
    },
    {
      slide: 'Slide 21: Design Details',
      action: 'Detail the Decoupled Client-Server & Edge Hybrid Architecture: On-device ONNX inference for privacy, Cloud Firestore for sync, and Web Dashboard for doctors.',
    },
  ];

  slideUpdates.forEach((item) => {
    checkPageBreak(38);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 32, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(item.slide, margin + 6, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const splitAct = doc.splitTextToSize(item.action, contentWidth - 12);
    doc.text(splitAct, margin + 6, y + 21);

    y += 36;
  });

  // --- SECTION: ANTICIPATED VIVA QUESTIONS ---
  checkPageBreak(120);
  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text('4. Anticipated Viva / Examiner Questions & Winning Answers', margin, y);
  y += 16;

  const vivaQA = [
    {
      q: 'Q1: Why did you build both a Mobile App and a Doctor Web Portal?',
      a: 'Patients need a private, convenient mobile app to log daily symptoms, temperature, and cycle changes anytime. On the other hand, doctors need a desktop-friendly web dashboard with widescreen data visualization, multi-cycle trend charts, and clinical PDF reviews to evaluate patients during clinical consultations without looking at a phone screen.',
    },
    {
      q: 'Q2: Why use ONNX Runtime on the phone instead of calling a Python server?',
      a: 'Menstrual and reproductive health data is highly personal and sensitive under HIPAA and data privacy principles. Transmitting raw symptoms to a remote server creates security risks and requires a constant internet connection. By compiling our trained Rotterdam model to ONNX format and loading it directly in Android using our custom Kotlin plugin (OnnxPredictorPlugin), inference runs in under 30 milliseconds completely offline.',
    },
    {
      q: 'Q3: How does your PCOS diagnosis differ from standard cycle trackers?',
      a: 'Standard trackers only look at missed days. HealthTrack+ implements the international 2003/2018 Rotterdam Consensus Guidelines, evaluating 19 parameters including hyperandrogenism (mFG hirsutism, cystic acne, alopecia) and medication masking overrides for birth control, classifying patients into Phenotypes A, B, C, or D.',
    },
  ];

  vivaQA.forEach((item) => {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(item.q, margin, y);
    y += 11;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const splitA = doc.splitTextToSize(item.a, contentWidth);
    doc.text(splitA, margin, y);
    y += splitA.length * 10 + 10;
  });

  // Add footers across all generated pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeader();
    addFooter();
  }

  const pdfOutput = doc.output('arraybuffer');
  const outputPath = path.join(process.cwd(), 'public', 'HealthTrackPlus_PPT_Correction_Guide.pdf');
  fs.writeFileSync(outputPath, Buffer.from(pdfOutput));
  console.log('PDF successfully generated at:', outputPath);

  const rootOutputPath = path.join(process.cwd(), 'HealthTrackPlus_PPT_Correction_Guide.pdf');
  fs.writeFileSync(rootOutputPath, Buffer.from(pdfOutput));
  console.log('Root PDF copy successfully generated at:', rootOutputPath);
}

generatePDF();
