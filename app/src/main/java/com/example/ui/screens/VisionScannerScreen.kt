package com.example.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.example.data.model.*
import com.example.ui.theme.*
import com.example.ui.viewmodel.AuraUiState

@Composable
fun VisionScannerScreen(
  uiState: AuraUiState,
  onSelectScanType: (ScanType) -> Unit,
  onToggleCamera: () -> Unit,
  onToggleTorch: () -> Unit,
  onTriggerScan: () -> Unit,
  onDismissResult: () -> Unit,
  onApplyResultToLog: () -> Unit,
  modifier: Modifier = Modifier
) {
  val isScanning = uiState.scannerStatus == ScannerStatus.ALIGNING || uiState.scannerStatus == ScannerStatus.ANALYZING
  val result = uiState.scanResult
  val context = LocalContext.current

  var hasCameraPermission by remember {
    mutableStateOf(
      ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
    )
  }

  val cameraLauncher = rememberLauncherForActivityResult(
    contract = ActivityResultContracts.RequestPermission()
  ) { isGranted ->
    hasCameraPermission = isGranted
    if (isGranted) {
      onTriggerScan()
    }
  }

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(AuraBackground)
  ) {
    // Top Bar Header
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp, vertical = 12.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Column {
        Text(
          text = "AI Vision Scanner",
          style = MaterialTheme.typography.titleLarge,
          color = TextPrimary,
          fontWeight = FontWeight.SemiBold
        )
        Text(
          text = "Computer Vision Biomarker Detection",
          style = MaterialTheme.typography.labelSmall,
          color = TextSecondary
        )
      }

      // Privacy Badge
      Surface(
        shape = RoundedCornerShape(12.dp),
        color = SageGreenContainer,
        border = androidx.compose.foundation.BorderStroke(1.dp, SageGreen.copy(alpha = 0.4f))
      ) {
        Row(
          modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Icon(
            imageVector = Icons.Rounded.Lock,
            contentDescription = null,
            tint = SageGreenLight,
            modifier = Modifier.size(13.dp)
          )
          Spacer(modifier = Modifier.width(4.dp))
          Text(
            text = "100% On-Device",
            style = MaterialTheme.typography.labelSmall,
            color = SageGreenLight,
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium
          )
        }
      }
    }

    // Scan Type Selector Tabs
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp, vertical = 4.dp),
      horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      ScanType.values().forEach { type ->
        val isSelected = uiState.scanType == type
        Surface(
          shape = RoundedCornerShape(16.dp),
          color = if (isSelected) BlushRoseContainer else AuraSurfaceVariant,
          border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isSelected) BlushRose else GlassStroke
          ),
          modifier = Modifier
            .weight(1f)
            .clip(RoundedCornerShape(16.dp))
            .clickable { onSelectScanType(type) }
        ) {
          Column(
            modifier = Modifier.padding(vertical = 10.dp, horizontal = 12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
          ) {
            Text(
              text = type.title,
              style = MaterialTheme.typography.labelMedium,
              color = if (isSelected) BlushRoseLight else TextSecondary,
              fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
              fontSize = 12.sp,
              textAlign = TextAlign.Center
            )
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(10.dp))

    // Main Camera Viewfinder Frame
    Box(
      modifier = Modifier
        .fillMaxWidth()
        .weight(1f)
        .padding(horizontal = 20.dp)
        .clip(RoundedCornerShape(24.dp))
        .background(AuraSurfaceElevated)
        .border(1.dp, GlassStroke, RoundedCornerShape(24.dp)),
      contentAlignment = Alignment.Center
    ) {
      // Viewfinder Background Texture / Simulated Camera Feed
      ViewfinderVisualBackground(
        scanType = uiState.scanType,
        isFlashlightOn = uiState.isTorchEnabled
      )

      // Reticle & Corner Brackets Overlay
      ViewfinderOverlayCanvas(
        scanType = uiState.scanType,
        isScanning = isScanning,
        scanProgress = uiState.scanProgress
      )

      // Top floating controls inside camera
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .align(Alignment.TopCenter)
          .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Surface(
          shape = RoundedCornerShape(12.dp),
          color = AuraSurface.copy(alpha = 0.7f),
          border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke)
        ) {
          Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Box(
              modifier = Modifier
                .size(8.dp)
                .clip(CircleShape)
                .background(if (isScanning) BlushRose else SageGreen)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
              text = if (isScanning) "AI Analyzing..." else "Optical Ready",
              style = MaterialTheme.typography.labelSmall,
              color = TextPrimary,
              fontSize = 11.sp
            )
          }
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          IconButton(
            onClick = onToggleTorch,
            modifier = Modifier
              .size(36.dp)
              .background(
                if (uiState.isTorchEnabled) ChampagneGoldContainer else AuraSurface.copy(alpha = 0.7f),
                CircleShape
              )
          ) {
            Icon(
              imageVector = if (uiState.isTorchEnabled) Icons.Rounded.FlashOn else Icons.Rounded.FlashOff,
              contentDescription = "Torch",
              tint = if (uiState.isTorchEnabled) ChampagneGoldLight else TextPrimary,
              modifier = Modifier.size(18.dp)
            )
          }

          IconButton(
            onClick = onToggleCamera,
            modifier = Modifier
              .size(36.dp)
              .background(AuraSurface.copy(alpha = 0.7f), CircleShape)
          ) {
            Icon(
              imageVector = Icons.Rounded.FlipCameraAndroid,
              contentDescription = "Flip Camera",
              tint = TextPrimary,
              modifier = Modifier.size(18.dp)
            )
          }
        }
      }

      // Bottom guidance inside viewfinder
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .align(Alignment.BottomCenter)
          .padding(bottom = 16.dp, start = 16.dp, end = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
      ) {
        Surface(
          shape = RoundedCornerShape(12.dp),
          color = AuraSurface.copy(alpha = 0.85f),
          border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke)
        ) {
          Text(
            text = when (uiState.scanType) {
              ScanType.FACIAL_SYMPTOM -> "Align jawline & chin within the reticle under even lighting"
              ScanType.FLOW_DETECTION -> "Center absorbent surface inside the frame from 20cm distance"
            },
            style = MaterialTheme.typography.bodySmall,
            color = TextSecondary,
            fontSize = 11.sp,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)
          )
        }
      }
    }

    Spacer(modifier = Modifier.height(14.dp))

    // Capture & Trigger Controls
    Box(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp, vertical = 8.dp),
      contentAlignment = Alignment.Center
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically
      ) {
        // Trigger Shutter Button
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
          Box(
            modifier = Modifier
              .size(72.dp)
              .clip(CircleShape)
              .border(2.dp, BlushRose, CircleShape)
              .padding(5.dp)
              .clip(CircleShape)
              .background(if (isScanning) AuraSurfaceVariant else BlushRose)
              .clickable(enabled = !isScanning) {
                if (hasCameraPermission) {
                  onTriggerScan()
                } else {
                  cameraLauncher.launch(Manifest.permission.CAMERA)
                }
              },
            contentAlignment = Alignment.Center
          ) {
            if (isScanning) {
              CircularProgressIndicator(
                modifier = Modifier.size(32.dp),
                color = BlushRose,
                strokeWidth = 3.dp
              )
            } else {
              Icon(
                imageVector = Icons.Rounded.CameraAlt,
                contentDescription = "Capture",
                tint = TextOnAccent,
                modifier = Modifier.size(28.dp)
              )
            }
          }
          if (!hasCameraPermission) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
              text = "Tap to grant camera permission",
              style = MaterialTheme.typography.labelSmall,
              color = BlushRose,
              fontSize = 10.sp
            )
          }
        }
      }
    }

    // Results Bottom Dialog / Card (if scan completed)
    if (result != null) {
      ScanResultModalCard(
        result = result,
        onDismiss = onDismissResult,
        onApply = onApplyResultToLog
      )
    }
  }
}

@Composable
fun ViewfinderVisualBackground(
  scanType: ScanType,
  isFlashlightOn: Boolean
) {
  Box(
    modifier = Modifier
      .fillMaxSize()
      .background(
        Brush.radialGradient(
          colors = listOf(
            if (isFlashlightOn) Color(0xFF2E3240) else Color(0xFF1E222D),
            Color(0xFF13161F)
          )
        )
      ),
    contentAlignment = Alignment.Center
  ) {
    // Subtle silhouette guide in background
    Icon(
      imageVector = if (scanType == ScanType.FACIAL_SYMPTOM) Icons.Rounded.Face else Icons.Rounded.WaterDrop,
      contentDescription = null,
      tint = TextMuted.copy(alpha = 0.12f),
      modifier = Modifier.size(170.dp)
    )
  }
}

@Composable
fun ViewfinderOverlayCanvas(
  scanType: ScanType,
  isScanning: Boolean,
  scanProgress: Float
) {
  val infiniteTransition = rememberInfiniteTransition(label = "ScanLaser")
  val laserPosition by infiniteTransition.animateFloat(
    initialValue = 0.15f,
    targetValue = 0.85f,
    animationSpec = infiniteRepeatable(
      animation = tween(1400, easing = LinearEasing),
      repeatMode = RepeatMode.Reverse
    ),
    label = "LaserPos"
  )

  Canvas(modifier = Modifier.fillMaxSize()) {
    val w = size.width
    val h = size.height
    val bracketSize = 28.dp.toPx()
    val strokeWidth = 3.dp.toPx()
    val margin = 40.dp.toPx()

    val left = margin
    val top = margin + 30.dp.toPx()
    val right = w - margin
    val bottom = h - margin - 30.dp.toPx()

    // 4 Corner Brackets (Targeting reticle)
    val bracketColor = if (isScanning) BlushRose else SageGreen

    // Top-Left
    drawLine(bracketColor, Offset(left, top), Offset(left + bracketSize, top), strokeWidth, StrokeCap.Round)
    drawLine(bracketColor, Offset(left, top), Offset(left, top + bracketSize), strokeWidth, StrokeCap.Round)

    // Top-Right
    drawLine(bracketColor, Offset(right, top), Offset(right - bracketSize, top), strokeWidth, StrokeCap.Round)
    drawLine(bracketColor, Offset(right, top), Offset(right, top + bracketSize), strokeWidth, StrokeCap.Round)

    // Bottom-Left
    drawLine(bracketColor, Offset(left, bottom), Offset(left + bracketSize, bottom), strokeWidth, StrokeCap.Round)
    drawLine(bracketColor, Offset(left, bottom), Offset(left, bottom - bracketSize), strokeWidth, StrokeCap.Round)

    // Bottom-Right
    drawLine(bracketColor, Offset(right, bottom), Offset(right - bracketSize, bottom), strokeWidth, StrokeCap.Round)
    drawLine(bracketColor, Offset(right, bottom), Offset(right, bottom - bracketSize), strokeWidth, StrokeCap.Round)

    // Scanning Laser Sweep Line
    if (isScanning) {
      val laserY = top + (bottom - top) * laserPosition
      drawLine(
        brush = Brush.horizontalGradient(
          colors = listOf(Color.Transparent, BlushRose, Color.White, BlushRose, Color.Transparent)
        ),
        start = Offset(left + 10, laserY),
        end = Offset(right - 10, laserY),
        strokeWidth = 3.dp.toPx(),
        cap = StrokeCap.Round
      )
    }
  }
}

@Composable
fun ScanResultModalCard(
  result: VisionScanResult,
  onDismiss: () -> Unit,
  onApply: () -> Unit
) {
  Surface(
    modifier = Modifier
      .fillMaxWidth()
      .padding(16.dp),
    shape = RoundedCornerShape(24.dp),
    color = AuraSurface,
    border = androidx.compose.foundation.BorderStroke(1.dp, BlushRose.copy(alpha = 0.5f)),
    shadowElevation = 12.dp
  ) {
    Column(modifier = Modifier.padding(20.dp)) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(
            imageVector = Icons.Rounded.AutoAwesome,
            contentDescription = null,
            tint = BlushRose,
            modifier = Modifier.size(20.dp)
          )
          Spacer(modifier = Modifier.width(8.dp))
          Text(
            text = "AI Optical Analysis Complete",
            style = MaterialTheme.typography.titleMedium,
            color = TextPrimary,
            fontWeight = FontWeight.SemiBold
          )
        }

        Surface(
          shape = RoundedCornerShape(10.dp),
          color = SageGreenContainer
        ) {
          Text(
            text = "${(result.confidenceScore * 100).toInt()}% Match",
            style = MaterialTheme.typography.labelSmall,
            color = SageGreenLight,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
          )
        }
      }

      Spacer(modifier = Modifier.height(12.dp))

      Text(
        text = result.primaryFinding,
        style = MaterialTheme.typography.titleSmall,
        color = BlushRoseLight,
        fontWeight = FontWeight.SemiBold
      )

      Spacer(modifier = Modifier.height(8.dp))

      Text(
        text = result.clinicalInsight,
        style = MaterialTheme.typography.bodySmall,
        color = TextSecondary,
        lineHeight = 18.sp
      )

      Spacer(modifier = Modifier.height(14.dp))

      // Metrics Row
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
      ) {
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = AuraSurfaceVariant,
          modifier = Modifier.weight(1f)
        ) {
          Column(modifier = Modifier.padding(10.dp)) {
            Text(text = result.metricLabel1, style = MaterialTheme.typography.labelSmall, color = TextMuted)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = result.metricValue1, style = MaterialTheme.typography.labelMedium, color = TextPrimary, fontWeight = FontWeight.SemiBold)
          }
        }

        Surface(
          shape = RoundedCornerShape(14.dp),
          color = AuraSurfaceVariant,
          modifier = Modifier.weight(1f)
        ) {
          Column(modifier = Modifier.padding(10.dp)) {
            Text(text = result.metricLabel2, style = MaterialTheme.typography.labelSmall, color = TextMuted)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = result.metricValue2, style = MaterialTheme.typography.labelMedium, color = TextPrimary, fontWeight = FontWeight.SemiBold)
          }
        }
      }

      Spacer(modifier = Modifier.height(16.dp))

      // Action Buttons
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
      ) {
        OutlinedButton(
          onClick = onDismiss,
          shape = RoundedCornerShape(14.dp),
          border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke),
          modifier = Modifier.weight(1f)
        ) {
          Text("Dismiss", color = TextSecondary)
        }

        Button(
          onClick = onApply,
          shape = RoundedCornerShape(14.dp),
          colors = ButtonDefaults.buttonColors(
            containerColor = BlushRose,
            contentColor = TextOnAccent
          ),
          modifier = Modifier.weight(1.5f)
        ) {
          Text(result.suggestedLogAction, fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
        }
      }
    }
  }
}
