package com.example.data.model

enum class CalendarDayType {
  PERIOD_LOGGED,
  PERIOD_PREDICTED,
  FERTILE_WINDOW,
  OVULATION_PEAK,
  FOLLICULAR_REGULAR,
  LUTEAL_REGULAR,
  TODAY
}

data class PredictiveDay(
  val dateString: String,
  val dayOfMonth: Int,
  val monthName: String,
  val cycleDay: Int,
  val type: CalendarDayType,
  val symptomNotes: String? = null,
  val crampsSeverity: Int = 0 // 0-10
)

data class TrendPoint(
  val label: String,
  val value: Float, // 0 - 100
  val secondaryValue: Float = 0f,
  val note: String = ""
)

data class CycleHistorySummary(
  val averageCycleLengthDays: Int = 28,
  val cycleVariationDays: Int = 2,
  val averagePeriodDays: Int = 5,
  val regularCyclesPercentage: Int = 92,
  val trackedCyclesCount: Int = 6,
  val ovulationPredictability: String = "High Regularity (Day 14 ± 1)"
)
