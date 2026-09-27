package com.example.data.model

enum class ScanType(val title: String, val description: String) {
  FACIAL_SYMPTOM("Facial Symptom & Acne", "Analyzes jawline breakout patterns, sebum density & hair follicle markers"),
  FLOW_DETECTION("Pad / Flow Detection", "Estimates flow volume stage, color shade integrity & saturation percentage")
}

enum class ScannerStatus {
  IDLE,
  ALIGNING,
  ANALYZING,
  COMPLETED,
  FAILED
}

data class VisionScanResult(
  val scanType: ScanType,
  val timestamp: String,
  val confidenceScore: Float, // e.g. 0.94f
  val primaryFinding: String,
  val metricLabel1: String,
  val metricValue1: String,
  val metricLabel2: String,
  val metricValue2: String,
  val clinicalInsight: String,
  val suggestedLogAction: String,
  val isLocalOnDevice: Boolean = true
)
