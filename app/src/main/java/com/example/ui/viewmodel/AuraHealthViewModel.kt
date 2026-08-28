package com.example.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.model.*
import com.example.data.repository.AuraHealthRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class AuraUiState(
  val userName: String = "Maya",
  val cycleInfo: CycleInfo = CycleInfo(),
  val hormoneLevels: List<HormoneLevel> = emptyList(),
  val todayLog: DailyLog = DailyLog("Today", 8),
  val currentScreenIndex: Int = 0, // 0: Home, 1: PCOS, 2: Vision Scanner, 3: Insights
  val isLogSheetOpen: Boolean = false,
  val isNotificationSheetOpen: Boolean = false,
  val notifications: List<Pair<String, String>> = emptyList(),
  val unreadNotifications: Int = 2,
  
  // PCOS Quiz State
  val quizQuestions: List<QuizQuestion> = emptyList(),
  val currentQuestionIndex: Int = 0,
  val selectedOptionIds: Set<String> = emptySet(),
  val pcosResult: AssessmentResult = AssessmentResult(),
  val isQuizCompleted: Boolean = false,
  val isTakingQuiz: Boolean = false,
  
  // Vision Scanner State
  val scanType: ScanType = ScanType.FACIAL_SYMPTOM,
  val scannerStatus: ScannerStatus = ScannerStatus.IDLE,
  val scanResult: VisionScanResult? = null,
  val scanProgress: Float = 0f,
  val isFrontCamera: Boolean = true,
  val isTorchEnabled: Boolean = false,
  
  // Insights State
  val predictiveDays: List<PredictiveDay> = emptyList(),
  val selectedDay: PredictiveDay? = null,
  val selectedMonthFilter: String = "OCT",
  val historicalTrends: List<TrendPoint> = emptyList(),
  val cycleSummary: CycleHistorySummary = CycleHistorySummary()
)

class AuraHealthViewModel(
  private val repository: AuraHealthRepository = AuraHealthRepository()
) : ViewModel() {

  private val _uiState = MutableStateFlow(AuraUiState())
  val uiState: StateFlow<AuraUiState> = _uiState.asStateFlow()

  init {
    loadInitialData()
  }

  private fun loadInitialData() {
    val initialCycle = repository.getInitialCycleInfo()
    val initialHormones = repository.getHormoneLevels()
    val initialDailyLog = repository.getTodayDailyLog()
    val questions = repository.getPcosQuizQuestions()
    val initialPcos = repository.getInitialAssessmentResult()
    val days = repository.getPredictive90Days()
    val trends = repository.getHistoricalTrends()
    val summary = repository.getCycleSummary()
    val notifications = repository.getNotifications()

    _uiState.update {
      it.copy(
        userName = repository.getUserProfileName(),
        cycleInfo = initialCycle,
        hormoneLevels = initialHormones,
        todayLog = initialDailyLog,
        quizQuestions = questions,
        pcosResult = initialPcos,
        predictiveDays = days,
        selectedDay = days.find { day -> day.type == CalendarDayType.TODAY },
        historicalTrends = trends,
        cycleSummary = summary,
        notifications = notifications,
        unreadNotifications = notifications.size
      )
    }
  }

  fun setScreen(index: Int) {
    _uiState.update { it.copy(currentScreenIndex = index) }
  }

  fun openLogSheet() {
    _uiState.update { it.copy(isLogSheetOpen = true) }
  }

  fun closeLogSheet() {
    _uiState.update { it.copy(isLogSheetOpen = false) }
  }

  fun openNotificationSheet() {
    _uiState.update { it.copy(isNotificationSheetOpen = true, unreadNotifications = 0) }
  }

  fun closeNotificationSheet() {
    _uiState.update { it.copy(isNotificationSheetOpen = false) }
  }

  fun toggleQuickSymptom(symptomId: String) {
    val currentSet = _uiState.value.todayLog.activeQuickSymptoms.toMutableSet()
    if (currentSet.contains(symptomId)) {
      currentSet.remove(symptomId)
    } else {
      currentSet.add(symptomId)
    }
    _uiState.update {
      it.copy(todayLog = it.todayLog.copy(activeQuickSymptoms = currentSet))
    }
  }

  fun updateDailyLog(
    flow: FlowLevel,
    cramps: Int,
    energy: Int,
    mood: MoodType,
    skin: SkinCondition,
    sleep: Float,
    bbt: Float,
    mucus: String,
    notes: String
  ) {
    _uiState.update {
      it.copy(
        todayLog = it.todayLog.copy(
          flow = flow,
          crampsLevel = cramps,
          energyLevel = energy,
          mood = mood,
          skinCondition = skin,
          sleepHours = sleep,
          basalTemp = bbt,
          cervicalMucus = mucus,
          notes = notes
        ),
        isLogSheetOpen = false
      )
    }
  }

  // --- PCOS Questionnaire Actions ---

  fun startPcosQuiz() {
    _uiState.update {
      it.copy(
        currentScreenIndex = 1,
        isTakingQuiz = true,
        isQuizCompleted = false,
        currentQuestionIndex = 0,
        selectedOptionIds = emptySet()
      )
    }
  }

  fun selectQuizOption(question: QuizQuestion, optionId: String) {
    val updated = _uiState.value.selectedOptionIds.toMutableSet()
    if (question.isMultiSelect) {
      // Toggle
      if (updated.contains(optionId)) {
        updated.remove(optionId)
      } else {
        // If selecting a "none" option, remove others, or vice-versa
        if (optionId.endsWith("4") && optionId.startsWith("a") || optionId.endsWith("4") && optionId.startsWith("m")) {
          updated.clear()
          updated.add(optionId)
        } else {
          updated.remove("a4")
          updated.remove("m4")
          updated.add(optionId)
        }
      }
    } else {
      // Single select: clear options belonging to this question
      val thisQuestionOptionIds = question.options.map { it.id }.toSet()
      updated.removeAll(thisQuestionOptionIds)
      updated.add(optionId)
    }
    _uiState.update { it.copy(selectedOptionIds = updated) }
  }

  fun nextQuizQuestion() {
    val currentIndex = _uiState.value.currentQuestionIndex
    val total = _uiState.value.quizQuestions.size
    if (currentIndex < total - 1) {
      _uiState.update { it.copy(currentQuestionIndex = currentIndex + 1) }
    } else {
      submitQuiz()
    }
  }

  fun previousQuizQuestion() {
    val currentIndex = _uiState.value.currentQuestionIndex
    if (currentIndex > 0) {
      _uiState.update { it.copy(currentQuestionIndex = currentIndex - 1) }
    }
  }

  fun submitQuiz() {
    val result = repository.calculatePcosResult(_uiState.value.selectedOptionIds)
    _uiState.update {
      it.copy(
        pcosResult = result,
        isQuizCompleted = true,
        isTakingQuiz = false
      )
    }
  }

  fun retakeQuiz() {
    startPcosQuiz()
  }

  // --- AI Vision Scanner Actions ---

  fun setScanType(type: ScanType) {
    _uiState.update {
      it.copy(
        scanType = type,
        scannerStatus = ScannerStatus.IDLE,
        scanResult = null,
        scanProgress = 0f
      )
    }
  }

  fun toggleCameraLens() {
    _uiState.update { it.copy(isFrontCamera = !it.isFrontCamera) }
  }

  fun toggleTorch() {
    _uiState.update { it.copy(isTorchEnabled = !it.isTorchEnabled) }
  }

  fun triggerScan() {
    if (_uiState.value.scannerStatus == ScannerStatus.ANALYZING) return

    viewModelScope.launch {
      _uiState.update { it.copy(scannerStatus = ScannerStatus.ALIGNING, scanProgress = 0.2f) }
      delay(700)
      _uiState.update { it.copy(scannerStatus = ScannerStatus.ANALYZING, scanProgress = 0.6f) }
      delay(1000)
      _uiState.update { it.copy(scanProgress = 1.0f) }
      delay(400)
      val result = repository.getSampleVisionResult(_uiState.value.scanType)
      _uiState.update {
        it.copy(
          scannerStatus = ScannerStatus.COMPLETED,
          scanResult = result
        )
      }
    }
  }

  fun dismissScanResult() {
    _uiState.update {
      it.copy(
        scannerStatus = ScannerStatus.IDLE,
        scanResult = null,
        scanProgress = 0f
      )
    }
  }

  fun applyScanResultToLog() {
    val result = _uiState.value.scanResult ?: return
    val currentSet = _uiState.value.todayLog.activeQuickSymptoms.toMutableSet()
    if (result.scanType == ScanType.FACIAL_SYMPTOM) {
      currentSet.add("skin")
    } else {
      currentSet.add("flow")
    }
    _uiState.update {
      it.copy(
        todayLog = it.todayLog.copy(activeQuickSymptoms = currentSet),
        scannerStatus = ScannerStatus.IDLE,
        scanResult = null,
        scanProgress = 0f
      )
    }
  }

  // --- Insights Actions ---

  fun selectPredictiveDay(day: PredictiveDay) {
    _uiState.update { it.copy(selectedDay = day) }
  }

  fun setMonthFilter(month: String) {
    _uiState.update { it.copy(selectedMonthFilter = month) }
  }
}
