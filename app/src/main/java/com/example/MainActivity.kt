package com.example

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.BatteryFull
import androidx.compose.material.icons.rounded.SignalCellular4Bar
import androidx.compose.material.icons.rounded.Wifi
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ui.components.AuraBottomNavigation
import com.example.ui.components.LogSymptomsSheet
import com.example.ui.components.NotificationSheet
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.InsightsScreen
import com.example.ui.screens.PcosScreen
import com.example.ui.screens.VisionScannerScreen
import com.example.ui.theme.*
import com.example.ui.viewmodel.AuraHealthViewModel

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      AuraHealthTheme {
        AuraApp()
      }
    }
  }
}

@Composable
fun AuraApp(
  viewModel: AuraHealthViewModel = viewModel()
) {
  val uiState by viewModel.uiState.collectAsStateWithLifecycle()
  val context = LocalContext.current

  // Dynamic runtime permissions check for Camera and Android 13+ Notifications
  val permissionsToRequest = remember {
    buildList {
      add(Manifest.permission.CAMERA)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        add(Manifest.permission.POST_NOTIFICATIONS)
      }
    }.toTypedArray()
  }

  val permissionLauncher = rememberLauncherForActivityResult(
    contract = ActivityResultContracts.RequestMultiplePermissions()
  ) { permissionsMap ->
    // Runtime permissions granted by user
  }

  LaunchedEffect(Unit) {
    val needsPermission = permissionsToRequest.any { perm ->
      ContextCompat.checkSelfPermission(context, perm) != PackageManager.PERMISSION_GRANTED
    }
    if (needsPermission) {
      permissionLauncher.launch(permissionsToRequest)
    }
  }

  Scaffold(
    modifier = Modifier.fillMaxSize(),
    containerColor = AuraBackground,
    topBar = {
      AndroidStatusBar()
    },
    bottomBar = {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .background(AuraBackground)
      ) {
        AuraBottomNavigation(
          currentScreenIndex = uiState.currentScreenIndex,
          onScreenSelected = { viewModel.setScreen(it) }
        )
        // Android 14 Gesture Navigation Bar Indicator
        Box(
          modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
          contentAlignment = Alignment.Center
        ) {
          Box(
            modifier = Modifier
              .width(72.dp)
              .height(4.dp)
              .clip(CircleShape)
              .background(TextMuted.copy(alpha = 0.5f))
          )
        }
      }
    }
  ) { innerPadding ->
    Box(
      modifier = Modifier
        .fillMaxSize()
        .padding(innerPadding)
    ) {
      AnimatedContent(
        targetState = uiState.currentScreenIndex,
        transitionSpec = {
          fadeIn() togetherWith fadeOut()
        },
        label = "ScreenNavigationTransition"
      ) { targetIndex ->
        when (targetIndex) {
          0 -> HomeScreen(
            uiState = uiState,
            onNotificationClick = { viewModel.openNotificationSheet() },
            onOpenLogSheet = { viewModel.openLogSheet() },
            onToggleQuickSymptom = { viewModel.toggleQuickSymptom(it) },
            onStartPcosAssessment = { viewModel.startPcosQuiz() },
            onOpenScanner = { viewModel.setScreen(2) },
            onOpenInsights = { viewModel.setScreen(3) }
          )
          1 -> PcosScreen(
            uiState = uiState,
            onStartQuiz = { viewModel.startPcosQuiz() },
            onSelectOption = { q, optId -> viewModel.selectQuizOption(q, optId) },
            onNextQuestion = { viewModel.nextQuizQuestion() },
            onPreviousQuestion = { viewModel.previousQuizQuestion() },
            onSubmitQuiz = { viewModel.submitQuiz() },
            onRetakeQuiz = { viewModel.retakeQuiz() }
          )
          2 -> VisionScannerScreen(
            uiState = uiState,
            onSelectScanType = { viewModel.setScanType(it) },
            onToggleCamera = { viewModel.toggleCameraLens() },
            onToggleTorch = { viewModel.toggleTorch() },
            onTriggerScan = { viewModel.triggerScan() },
            onDismissResult = { viewModel.dismissScanResult() },
            onApplyResultToLog = { viewModel.applyScanResultToLog() }
          )
          3 -> InsightsScreen(
            uiState = uiState,
            onSelectDay = { viewModel.selectPredictiveDay(it) },
            onSelectMonth = { viewModel.setMonthFilter(it) }
          )
        }
      }

      // Daily Symptom Logger Modal Sheet
      if (uiState.isLogSheetOpen) {
        LogSymptomsSheet(
          initialLog = uiState.todayLog,
          onDismiss = { viewModel.closeLogSheet() },
          onSave = { flow, cramps, energy, mood, skin, sleep, bbt, mucus, notes ->
            viewModel.updateDailyLog(flow, cramps, energy, mood, skin, sleep, bbt, mucus, notes)
          }
        )
      }

      // Notifications Sheet
      if (uiState.isNotificationSheetOpen) {
        NotificationSheet(
          notifications = uiState.notifications,
          onDismiss = { viewModel.closeNotificationSheet() }
        )
      }
    }
  }
}

@Composable
fun AndroidStatusBar() {
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .statusBarsPadding()
      .padding(horizontal = 24.dp, vertical = 6.dp),
    horizontalArrangement = Arrangement.SpaceBetween,
    verticalAlignment = Alignment.CenterVertically
  ) {
    Text(
      text = "9:41",
      style = MaterialTheme.typography.labelMedium,
      color = TextPrimary,
      fontWeight = FontWeight.SemiBold,
      fontSize = 13.sp
    )

    Row(
      horizontalArrangement = Arrangement.spacedBy(6.dp),
      verticalAlignment = Alignment.CenterVertically
    ) {
      Icon(
        imageVector = Icons.Rounded.SignalCellular4Bar,
        contentDescription = "5G",
        tint = TextPrimary,
        modifier = Modifier.size(14.dp)
      )
      Icon(
        imageVector = Icons.Rounded.Wifi,
        contentDescription = "Wi-Fi",
        tint = TextPrimary,
        modifier = Modifier.size(14.dp)
      )
      Icon(
        imageVector = Icons.Rounded.BatteryFull,
        contentDescription = "Battery",
        tint = TextPrimary,
        modifier = Modifier.size(14.dp)
      )
    }
  }
}
