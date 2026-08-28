package com.example.data.repository

import com.example.data.model.*

class AuraHealthRepository {

  fun getUserProfileName(): String = "Maya"

  fun getInitialCycleInfo(): CycleInfo {
    return CycleInfo(
      currentCycleDay = 8,
      totalCycleDays = 28,
      currentPhase = CyclePhase.FOLLICULAR,
      daysUntilPeriod = 14,
      periodDuration = 5,
      conceptionProbability = "Low Probability",
      conceptionPercentage = 12,
      daysUntilOvulation = 6,
      isFertileWindow = false,
      basalBodyTemp = 36.45f,
      restingHeartRate = 66,
      sleepScore = 91
    )
  }

  fun getHormoneLevels(): List<HormoneLevel> {
    return listOf(
      HormoneLevel("Estrogen", 0.48f, "Rising", "Supports follicle growth, cognitive focus and buoyant mood."),
      HormoneLevel("Progesterone", 0.12f, "Baseline", "Maintains resting baseline until post-ovulation luteal surge."),
      HormoneLevel("Luteinizing Hormone (LH)", 0.22f, "Preparing", "Expected surge in ~5–6 days triggering ovulation."),
      HormoneLevel("Follicle Stimulating (FSH)", 0.65f, "Active", "Actively nurturing dominant follicle selection.")
    )
  }

  fun getTodayDailyLog(): DailyLog {
    return DailyLog(
      date = "Today, Oct 24",
      cycleDay = 8,
      flow = FlowLevel.NONE,
      crampsLevel = 1,
      energyLevel = 8,
      mood = MoodType.CALM,
      skinCondition = SkinCondition.CLEAR,
      sleepHours = 8.2f,
      basalTemp = 36.45f,
      cervicalMucus = "Sticky / Creamy",
      activeQuickSymptoms = setOf("energy", "skin", "mood", "sleep"),
      notes = "Follicular phase vitality. Mind feels sharp, no cramps or skin flares."
    )
  }

  fun getPcosQuizQuestions(): List<QuizQuestion> {
    return listOf(
      QuizQuestion(
        id = 1,
        category = "Menstrual Regularity",
        title = "How regular and predictable are your menstrual cycles?",
        explanation = "Cycle intervals under 21 days or over 35 days (oligo/amenorrhea) are primary markers of irregular ovulatory cycles under the Rotterdam Consensus.",
        isMultiSelect = false,
        options = listOf(
          QuizOption("c1", "Very Regular (26–32 days)", "Predictable month-to-month variation within 2–3 days", 0),
          QuizOption("c2", "Slightly Variable (33–38 days)", "Cycles occasionally skip or arrive 1–2 weeks late", 15),
          QuizOption("c3", "Infrequent / Oligomenorrhea (>36–90 days)", "Fewer than 8 periods per calendar year", 30),
          QuizOption("c4", "Absent / Amenorrhea (>90 days without period)", "No natural menstruation without hormonal medication", 35)
        )
      ),
      QuizQuestion(
        id = 2,
        category = "Skin & Androgenic Signs",
        title = "Do you experience persistent androgenic signs (acne, hair thinning, or facial hair)?",
        explanation = "Elevated bioavailable androgens can trigger stubborn lower-jawline cystic acne, hirsutism (coarse chin/lip hair), or crown hair thinning.",
        isMultiSelect = true,
        options = listOf(
          QuizOption("a1", "Stubborn cystic acne along jawline / chin", "Resistant to standard topical skincare routines", 15),
          QuizOption("a2", "Excess coarse hair growth on chin, upper lip, or abdomen", "Hirsutism pattern requiring frequent removal", 20),
          QuizOption("a3", "Hair thinning or excessive shedding at scalp crown", "Androgenic-pattern diffuse thinning", 15),
          QuizOption("a4", "None of the above / balanced skin & hair", "No noticeable excess androgen symptoms", 0)
        )
      ),
      QuizQuestion(
        id = 3,
        category = "Metabolic & Energy Balance",
        title = "Have you noticed metabolic, weight, or insulin-related resistance markers?",
        explanation = "Up to 70% of individuals with PCOS have underlying insulin resistance, impacting cellular glucose uptake, cravings, and abdominal fat distribution.",
        isMultiSelect = true,
        options = listOf(
          QuizOption("m1", "Difficulty losing weight despite calorie & activity control", "Stubborn resistance, particularly central/visceral", 15),
          QuizOption("m2", "Intense post-meal energy crashes & sugar cravings", "Frequent reactive hypoglycemia sensation", 10),
          QuizOption("m3", "Acanthosis nigricans (darkened velvety skin on neck/underarms)", "Classic visual dermatological indicator of insulin resistance", 20),
          QuizOption("m4", "No metabolic or energy irregularities noted", "Stable daily energy and weight balance", 0)
        )
      ),
      QuizQuestion(
        id = 4,
        category = "Ovarian & Family History",
        title = "What is your clinical ultrasound and first-degree family history?",
        explanation = "Ultrasound findings showing 12+ peripheral antral follicles ('string of pearls') or maternal/sibling PCOS history indicate genetic susceptibility.",
        isMultiSelect = false,
        options = listOf(
          QuizOption("h1", "No known family history & normal pelvic ultrasound", "Never diagnosed with polycystic ovarian morphology", 0),
          QuizOption("h2", "Mother, sister, or aunt diagnosed with PCOS or Type 2 Diabetes", "Positive first-degree genetic predisposition", 15),
          QuizOption("h3", "Pelvic ultrasound previously showed polycystic morphology", "Confirmed clinical ultrasound visualization of enlarged ovaries", 30),
          QuizOption("h4", "Never had an ovarian ultrasound performed", "Ovarian morphology status currently unconfirmed", 5)
        )
      ),
      QuizQuestion(
        id = 5,
        category = "Ovulatory & PMS Severity",
        title = "How severe are your premenstrual or ovulatory physical symptoms?",
        explanation = "Chronic pelvic fullness, severe luteal mood disruptions (PMDD), or lack of distinct fertile cervical mucus patterns can reflect anovulatory cycles.",
        isMultiSelect = false,
        options = listOf(
          QuizOption("p1", "Mild or manageable PMS", "Slight breast tenderness or mild cramping on day 1", 0),
          QuizOption("p2", "Moderate PMS with noticeable mood shifts and fatigue", "Manageable with lifestyle adjustments", 10),
          QuizOption("p3", "Severe premenstrual dysphoria (PMDD) & chronic pelvic aches", "Debilitating monthly flare-ups and intense bloating", 20)
        )
      )
    )
  }

  fun calculatePcosResult(selectedOptionIds: Set<String>): AssessmentResult {
    // Tally points based on answers
    var totalPoints = 0
    val questions = getPcosQuizQuestions()
    for (q in questions) {
      for (opt in q.options) {
        if (selectedOptionIds.contains(opt.id)) {
          totalPoints += opt.points
        }
      }
    }

    // Scale to percentage (max ~ 110 points)
    val scorePercentage = (totalPoints.coerceIn(0, 110) * 100 / 110).coerceIn(10, 95)
    
    val riskLevel = when {
      scorePercentage < 35 -> PcosRiskLevel.LOW
      scorePercentage < 70 -> PcosRiskLevel.MODERATE
      else -> PcosRiskLevel.ELEVATED
    }

    val matchedRotterdam = mutableListOf<String>()
    if (selectedOptionIds.contains("c2") || selectedOptionIds.contains("c3") || selectedOptionIds.contains("c4")) {
      matchedRotterdam.add("Ovulatory Dysfunction (Oligo/Anovulation)")
    }
    if (selectedOptionIds.contains("a1") || selectedOptionIds.contains("a2") || selectedOptionIds.contains("a3")) {
      matchedRotterdam.add("Clinical Hyperandrogenism (Acne/Hirsutism)")
    }
    if (selectedOptionIds.contains("h3")) {
      matchedRotterdam.add("Polycystic Ovarian Morphology (Ultrasound)")
    }
    if (selectedOptionIds.contains("m1") || selectedOptionIds.contains("m3")) {
      matchedRotterdam.add("Metabolic / Insulin Resistance Markers")
    }

    val observations = mutableListOf<String>()
    when (riskLevel) {
      PcosRiskLevel.LOW -> {
        observations.add("Your cycle regularity and hormonal markers show low statistical risk for PCOS.")
        observations.add("Natural luteal and follicular transitions appear consistent and well-balanced.")
        observations.add("Skin and hair indicators show minimal androgenic stimulation.")
      }
      PcosRiskLevel.MODERATE -> {
        observations.add("Some hormonal or metabolic indicators (such as mild cycle fluctuation or localized skin flares) were identified.")
        observations.add("Monitoring basal body temperature and LH surge sticks can help confirm regular ovulation.")
        observations.add("Nutritional balancing with low glycemic index foods may support insulin sensitivity.")
      }
      PcosRiskLevel.ELEVATED -> {
        observations.add("Multiple key markers align with Rotterdam Consensus criteria for PCOS evaluation.")
        observations.add("Signs of ovulatory irregularity paired with hyperandrogenic symptoms warrant clinical follow-up.")
        observations.add("Insulin sensitivity and fasting lipid profiling are recommended for comprehensive clarity.")
      }
    }

    val nextSteps = when (riskLevel) {
      PcosRiskLevel.LOW -> listOf(
        "Continue logging daily symptoms and basal temperature.",
        "Maintain balanced whole-food nutrition with anti-inflammatory omegas.",
        "Schedule standard annual gynecological check-up."
      )
      PcosRiskLevel.MODERATE -> listOf(
        "Track cycle length variability over 90 days in the Aura Insights tab.",
        "Incorporate strength training and inositol-rich foods for metabolic health.",
        "Request a fasting insulin and total/free testosterone blood panel if symptoms persist."
      )
      PcosRiskLevel.ELEVATED -> listOf(
        "Book a dedicated consultation with an OB/GYN or reproductive endocrinologist.",
        "Request a comprehensive Day 3 hormone panel (FSH, LH, Total/Free Testosterone, DHEA-S, AMH, Fasting Insulin).",
        "Consider scheduling a transvaginal pelvic ultrasound to assess antral follicle count.",
        "Export this digital assessment report to share with your physician."
      )
    }

    val doctorQuestions = listOf(
      "Could we order a comprehensive reproductive hormone panel (AMH, LH/FSH ratio, DHEA-S)?",
      "Is a transvaginal or pelvic ultrasound appropriate to check my ovarian follicle architecture?",
      "Would checking fasting glucose and HbA1c help evaluate my metabolic sensitivity?",
      "What evidence-based lifestyle or supplement protocols (e.g. Myo-Inositol, Vitamin D3) do you recommend for my profile?"
    )

    return AssessmentResult(
      scorePercentage = scorePercentage,
      riskLevel = riskLevel,
      answeredQuestionsCount = questions.size,
      rotterdamCriteriaMatched = if (matchedRotterdam.isEmpty()) listOf("No Rotterdam criteria flags detected") else matchedRotterdam,
      keyObservations = observations,
      recommendedNextSteps = nextSteps,
      doctorDiscussionPoints = doctorQuestions
    )
  }

  fun getInitialAssessmentResult(): AssessmentResult {
    return AssessmentResult(
      scorePercentage = 22,
      riskLevel = PcosRiskLevel.LOW,
      answeredQuestionsCount = 5,
      rotterdamCriteriaMatched = listOf("No primary criteria flagged (Baseline healthy profile)"),
      keyObservations = listOf(
        "Cycle regularity falls within healthy 28-day physiological parameters.",
        "Minimal androgenic or metabolic markers recorded in recent symptom logs."
      ),
      recommendedNextSteps = listOf(
        "Continue tracking daily follicular and luteal symptoms.",
        "Support hormonal balance with balanced sleep and antioxidant-rich meals."
      ),
      doctorDiscussionPoints = listOf(
        "Discuss annual preventative reproductive wellness.",
        "Review basal body temperature trends."
      )
    )
  }

  fun getSampleVisionResult(scanType: ScanType): VisionScanResult {
    return when (scanType) {
      ScanType.FACIAL_SYMPTOM -> VisionScanResult(
        scanType = scanType,
        timestamp = "Just now",
        confidenceScore = 0.94f,
        primaryFinding = "Clear Jawline Profile • Low Inflammatory Sebum",
        metricLabel1 = "Blemish Density",
        metricValue1 = "0.2 / cm² (Minimal)",
        metricLabel2 = "Androgenic Pattern",
        metricValue2 = "Negative (No Hirsutism)",
        clinicalInsight = "Facial dermal analysis shows balanced follicular phase hydration with no deep hormonal cystic lesions detected along mandibular zone.",
        suggestedLogAction = "Mark 'Clear Skin' in Daily Log",
        isLocalOnDevice = true
      )
      ScanType.FLOW_DETECTION -> VisionScanResult(
        scanType = scanType,
        timestamp = "Just now",
        confidenceScore = 0.92f,
        primaryFinding = "Zero Active Discharge • Dry Surface",
        metricLabel1 = "Estimated Volume",
        metricValue1 = "< 1 mL / Day",
        metricLabel2 = "Color Shade",
        metricValue2 = "Baseline Clear",
        clinicalInsight = "Surface analysis detected no active menstrual bleeding, consistent with your current Cycle Day 8 (Follicular phase).",
        suggestedLogAction = "Mark 'No Flow' in Daily Log",
        isLocalOnDevice = true
      )
    }
  }

  fun getPredictive90Days(): List<PredictiveDay> {
    val list = mutableListOf<PredictiveDay>()
    
    // Generate 90 days centered around Day 8 of current cycle
    // Days -7 to -1: Past period and early follicular
    // Day 0: Today (Day 8)
    // Days 1 to 82: Upcoming 3 full cycles
    
    for (i in -7..82) {
      val dayOfCycle = ((i + 7) % 28) + 1
      val dayOfMonth = ((i + 23 + 31) % 31) + 1
      val monthName = when {
        i < 8 -> "OCT"
        i < 39 -> "NOV"
        i < 70 -> "DEC"
        else -> "JAN"
      }
      
      val type = when {
        i == 0 -> CalendarDayType.TODAY
        dayOfCycle in 1..5 && i < 0 -> CalendarDayType.PERIOD_LOGGED
        dayOfCycle in 1..5 && i > 0 -> CalendarDayType.PERIOD_PREDICTED
        dayOfCycle in 12..16 -> if (dayOfCycle == 14) CalendarDayType.OVULATION_PEAK else CalendarDayType.FERTILE_WINDOW
        dayOfCycle in 6..11 -> CalendarDayType.FOLLICULAR_REGULAR
        else -> CalendarDayType.LUTEAL_REGULAR
      }

      val cramps = when (dayOfCycle) {
        1 -> 7
        2 -> 5
        3 -> 3
        14 -> 2
        27, 28 -> 4
        else -> 0
      }

      val notes = when (type) {
        CalendarDayType.TODAY -> "Follicular Day 8 • Optimal energy window"
        CalendarDayType.PERIOD_LOGGED -> "Logged period flow (5 days)"
        CalendarDayType.PERIOD_PREDICTED -> "Predicted next menstruation"
        CalendarDayType.OVULATION_PEAK -> "Predicted Ovulation Peak (LH Surge)"
        CalendarDayType.FERTILE_WINDOW -> "Elevated conception probability"
        else -> null
      }

      list.add(
        PredictiveDay(
          dateString = "$monthName $dayOfMonth",
          dayOfMonth = dayOfMonth,
          monthName = monthName,
          cycleDay = dayOfCycle,
          type = type,
          symptomNotes = notes,
          crampsSeverity = cramps
        )
      )
    }
    return list
  }

  fun getHistoricalTrends(): List<TrendPoint> {
    return listOf(
      TrendPoint("Day 1", 70f, 15f, "Menstrual start - Cramps 7/10"),
      TrendPoint("Day 3", 45f, 25f, "Flow lightens, resting"),
      TrendPoint("Day 5", 15f, 40f, "Period ends, energy climbing"),
      TrendPoint("Day 8", 10f, 85f, "Today: Peak focus & clear skin"),
      TrendPoint("Day 12", 5f, 92f, "Pre-ovulatory surge window"),
      TrendPoint("Day 14", 20f, 90f, "Ovulation peak / fertile"),
      TrendPoint("Day 18", 10f, 75f, "Luteal transition, calm"),
      TrendPoint("Day 22", 15f, 65f, "Progesterone peak"),
      TrendPoint("Day 26", 35f, 50f, "Mild PMS symptoms"),
      TrendPoint("Day 28", 50f, 45f, "Cycle completion")
    )
  }

  fun getCycleSummary(): CycleHistorySummary {
    return CycleHistorySummary(
      averageCycleLengthDays = 28,
      cycleVariationDays = 2,
      averagePeriodDays = 5,
      regularCyclesPercentage = 94,
      trackedCyclesCount = 6,
      ovulationPredictability = "High Regularity (Predicted Day 14)"
    )
  }

  fun getNotifications(): List<Pair<String, String>> {
    return listOf(
      "Follicular Energy Surge" to "Day 8: Estrogen is steadily rising. This is your prime window for cognitive focus and high-intensity workouts.",
      "Hydration & Skin Health" to "Optimal hydration today supports dermal barrier function before your fertile window opens in 4 days.",
      "PCOS Risk Assessment" to "Your baseline score is Low Risk (22%). Retake every 90 days to monitor long-term hormonal stability."
    )
  }
}
