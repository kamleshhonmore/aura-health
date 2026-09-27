package com.example.data.model

enum class IntakeQuestionType {
  CALMING_INTRO,    // Phase 1: Regulate Before You Request (3-sec calming intro)
  DOMAIN_SELECT,    // Phase 2: Branching / Conditional Logic (instant domain pathing)
  SEGMENTED,        // Phase 3: 2 to 4 choices -> Segmented Controls / Toggle Tabs
  CHIPS_GRID,       // Phase 3: 4 to 6 choices -> Visual Option Chips (2x3 grid)
  CARDS_WITH_ICONS, // Phase 3: Complex choices -> Large Interactive Cards with Emojis/Icons
  SLIDER_RANGE,     // Phase 3: Numbers / Ranges -> Sliders & Steppers (+ / -)
  LOADER,           // Phase 1/4: "Data Hook" Loader animation ("Analyzing profile...")
  RESULTS           // Phase 4: Personalized Value Summary & Auto-saved Report
}

data class IntakeOption(
  val id: String,
  val title: String,
  val subtitle: String = "",
  val icon: String = ""
)

data class IntakeStepData(
  val id: Int,
  val domainTag: String,
  val title: String,
  val subtitle: String,
  val type: IntakeQuestionType,
  val options: List<IntakeOption> = emptyList(),
  val sliderMin: Float = 1f,
  val sliderMax: Float = 90f,
  val sliderStep: Float = 1f,
  val unit: String = "days"
)
