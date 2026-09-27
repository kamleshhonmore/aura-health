package com.example.data.model

enum class CyclePhase(
  val displayName: String,
  val subtitle: String,
  val description: String,
  val hormoneFocus: String
) {
  MENSTRUAL("Menstrual Phase", "Days 1–5", "Uterine lining shedding. Rest & gentle nourishment.", "Estrogen & Progesterone Low"),
  FOLLICULAR("Follicular Phase", "Days 6–13", "Follicle development & estrogen rise. Peak energy & focus.", "Estrogen Rising, FSH Active"),
  OVULATORY("Ovulatory Phase", "Days 14–16", "Luteinizing Hormone (LH) surge & egg release. Fertile window.", "Peak LH & Estrogen"),
  LUTEAL("Luteal Phase", "Days 17–28", "Progesterone dominant. Post-ovulation nesting & recovery.", "Progesterone Dominant")
}

data class CycleInfo(
  val currentCycleDay: Int = 8,
  val totalCycleDays: Int = 28,
  val currentPhase: CyclePhase = CyclePhase.FOLLICULAR,
  val daysUntilPeriod: Int = 14,
  val periodDuration: Int = 5,
  val conceptionProbability: String = "Low",
  val conceptionPercentage: Int = 14,
  val daysUntilOvulation: Int = 6,
  val isFertileWindow: Boolean = false,
  val basalBodyTemp: Float = 36.4f,
  val restingHeartRate: Int = 68,
  val sleepScore: Int = 88
)

data class HormoneLevel(
  val name: String,
  val valuePercentage: Float, // 0f to 1f
  val trend: String,
  val description: String
)
