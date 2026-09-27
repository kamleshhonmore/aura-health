package com.example.data.model

enum class PcosRiskLevel(
  val label: String,
  val scoreRange: String,
  val summary: String,
  val badgeColorHex: Long
) {
  LOW(
    label = "Low Probability",
    scoreRange = "0 – 34%",
    summary = "Symptoms align with standard hormonal variations. No strong clinical markers for polycystic ovarian syndrome detected.",
    badgeColorHex = 0xFF81C784
  ),
  MODERATE(
    label = "Moderate Risk",
    scoreRange = "35 – 69%",
    summary = "Several overlapping markers (e.g. slight cycle irregularity or hyperandrogenic signs) suggest hormonal imbalance worth tracking.",
    badgeColorHex = 0xFFFFB74D
  ),
  ELEVATED(
    label = "Elevated Risk",
    scoreRange = "70 – 100%",
    summary = "Key Rotterdam criteria indicators are present (oligo-ovulation, androgenic symptoms, metabolic predisposition). Clinical evaluation is strongly recommended.",
    badgeColorHex = 0xFFE57373
  )
}

enum class QuizInputType {
  SEGMENTED,   // 2 to 4 choices -> Instant mutual-exclusion tapping
  CHIPS_GRID,  // 4 to 6 choices -> Visual Option Chips (2x3 grid)
  CARDS,       // Complex choices -> Large Interactive Cards with Icons/Emojis
  SLIDER       // Numbers / Ranges -> Sliders or Steppers (+ / -)
}

data class QuizOption(
  val id: String,
  val title: String,
  val subtitle: String = "",
  val points: Int = 0,
  val icon: String = "" // Emoji or visual icon representation
)

data class QuizQuestion(
  val id: Int,
  val category: String,
  val title: String,
  val explanation: String,
  val isMultiSelect: Boolean = false,
  val inputType: QuizInputType = QuizInputType.CARDS,
  val options: List<QuizOption>
)

data class AssessmentResult(
  val scorePercentage: Int = 24,
  val riskLevel: PcosRiskLevel = PcosRiskLevel.LOW,
  val answeredQuestionsCount: Int = 5,
  val rotterdamCriteriaMatched: List<String> = emptyList(),
  val keyObservations: List<String> = emptyList(),
  val recommendedNextSteps: List<String> = emptyList(),
  val doctorDiscussionPoints: List<String> = emptyList(),
  val disclaimer: String = "Medical Disclaimer: This assessment uses evidence-based Rotterdam Consensus guidelines for informational purposes only. It is not a clinical diagnosis or medical substitute. Consult a certified OB/GYN or endocrinologist for blood tests and pelvic ultrasound evaluation."
)
