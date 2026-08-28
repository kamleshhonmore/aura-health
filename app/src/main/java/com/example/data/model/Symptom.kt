package com.example.data.model

enum class QuickSymptomCategory(
  val id: String,
  val label: String,
  val iconName: String,
  val defaultActive: Boolean = false
) {
  CRAMPS("cramps", "Cramps", "cramps_icon", false),
  ENERGY("energy", "High Energy", "energy_icon", true),
  SKIN_ACNE("skin", "Clear Skin", "skin_icon", true),
  MOOD("mood", "Calm & Balanced", "mood_icon", true),
  FLOW("flow", "No Flow", "flow_icon", false),
  SLEEP("sleep", "Good Sleep (8h)", "sleep_icon", true),
  BBT("bbt", "BBT 36.4°C", "bbt_icon", false)
}

enum class FlowLevel(val label: String, val levelNumber: Int) {
  NONE("None", 0),
  SPOTTING("Spotting", 1),
  LIGHT("Light", 2),
  MEDIUM("Medium", 3),
  HEAVY("Heavy", 4)
}

enum class MoodType(val label: String, val emoji: String) {
  CALM("Calm", "😌"),
  HAPPY("Happy", "✨"),
  ENERGETIC("Energetic", "⚡"),
  ANXIOUS("Anxious", "💭"),
  IRRITABLE("Irritable", "🌩️"),
  SAD("Low Mood", "🌧️"),
  FATIGUED("Fatigued", "🌙")
}

enum class SkinCondition(val label: String, val description: String) {
  CLEAR("Clear & Glowing", "Minimal sebum, zero active flares"),
  OILY("Slightly Oily", "T-zone shine"),
  BREAKOUT_MILD("Mild Breakout", "1-2 surface blemishes"),
  CYSTIC_FLARE("Hormonal Flare", "Deep jawline/chin inflammation"),
  DRY("Dry & Sensitive", "Requires hydration")
}

data class DailyLog(
  val date: String,
  val cycleDay: Int,
  val flow: FlowLevel = FlowLevel.NONE,
  val crampsLevel: Int = 1, // 0 - 10
  val energyLevel: Int = 8, // 1 - 10
  val mood: MoodType = MoodType.CALM,
  val skinCondition: SkinCondition = SkinCondition.CLEAR,
  val sleepHours: Float = 8.0f,
  val basalTemp: Float = 36.4f,
  val cervicalMucus: String = "Creamy / Sticky",
  val activeQuickSymptoms: Set<String> = setOf("energy", "skin", "mood", "sleep"),
  val notes: String = "Feeling focused and clear-minded during follicular phase."
)
