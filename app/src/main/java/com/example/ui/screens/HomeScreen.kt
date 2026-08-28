package com.example.ui.screens

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
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.*
import com.example.ui.components.*
import com.example.ui.theme.*
import com.example.ui.viewmodel.AuraUiState

@Composable
fun HomeScreen(
  uiState: AuraUiState,
  onNotificationClick: () -> Unit,
  onOpenLogSheet: () -> Unit,
  onToggleQuickSymptom: (String) -> Unit,
  onStartPcosAssessment: () -> Unit,
  onOpenScanner: () -> Unit,
  onOpenInsights: () -> Unit,
  modifier: Modifier = Modifier
) {
  val scrollState = rememberScrollState()

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(AuraBackground)
      .verticalScroll(scrollState)
      .padding(bottom = 16.dp)
  ) {
    // 1. Top Bar Header
    AuraTopBar(
      userName = uiState.userName,
      cycleInfo = uiState.cycleInfo,
      unreadCount = uiState.unreadNotifications,
      onNotificationClick = onNotificationClick
    )

    // 2. Hero Section: Custom Circular Cycle Progress Ring
    CycleProgressRing(
      cycleInfo = uiState.cycleInfo,
      onLogClick = onOpenLogSheet
    )

    Spacer(modifier = Modifier.height(6.dp))

    // 3. Quick Log Bar (Horizontal scrolling chips)
    QuickLogBar(
      activeSymptoms = uiState.todayLog.activeQuickSymptoms,
      onToggleSymptom = onToggleQuickSymptom,
      onOpenFullLog = onOpenLogSheet
    )

    Spacer(modifier = Modifier.height(10.dp))

    // 4. Prominent PCOS Risk Assessment Card
    PcosRiskCard(
      assessmentResult = uiState.pcosResult,
      onStartAssessment = onStartPcosAssessment
    )

    Spacer(modifier = Modifier.height(14.dp))

    // 5. Hormonal Rhythm Curve & Biomarker Tracker Card
    Surface(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp),
      shape = RoundedCornerShape(24.dp),
      color = AuraSurface,
      border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke)
    ) {
      Column(modifier = Modifier.padding(20.dp)) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
              modifier = Modifier
                .size(32.dp)
                .clip(CircleShape)
                .background(SageGreenContainer),
              contentAlignment = Alignment.Center
            ) {
              Icon(
                imageVector = Icons.Rounded.AutoGraph,
                contentDescription = null,
                tint = SageGreenLight,
                modifier = Modifier.size(18.dp)
              )
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column {
              Text(
                text = "Hormonal Biomarker Rhythm",
                style = MaterialTheme.typography.titleSmall,
                color = TextPrimary,
                fontWeight = FontWeight.SemiBold
              )
              Text(
                text = "Follicular Phase Trajectory",
                style = MaterialTheme.typography.labelSmall,
                color = TextSecondary
              )
            }
          }

          Text(
            text = "Trends",
            style = MaterialTheme.typography.labelSmall,
            color = SageGreenLight,
            modifier = Modifier
              .clickable { onOpenInsights() }
              .padding(4.dp)
          )
        }

        Spacer(modifier = Modifier.height(16.dp))

        uiState.hormoneLevels.forEach { hormone ->
          Column(modifier = Modifier.padding(vertical = 4.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Text(
                text = hormone.name,
                style = MaterialTheme.typography.labelMedium,
                color = TextPrimary,
                fontWeight = FontWeight.Medium
              )
              Text(
                text = hormone.trend,
                style = MaterialTheme.typography.labelSmall,
                color = if (hormone.trend == "Rising" || hormone.trend == "Active") SageGreenLight else TextSecondary,
                fontWeight = FontWeight.SemiBold
              )
            }
            Spacer(modifier = Modifier.height(6.dp))
            LinearProgressIndicator(
              progress = { hormone.valuePercentage },
              modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
              color = when (hormone.name) {
                "Estrogen" -> SageGreen
                "Progesterone" -> IndicatorLuteal
                "Luteinizing Hormone (LH)" -> ChampagneGold
                else -> BlushRose
              },
              trackColor = AuraSurfaceVariant
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
              text = hormone.description,
              style = MaterialTheme.typography.bodySmall,
              color = TextMuted,
              fontSize = 11.sp
            )
            Spacer(modifier = Modifier.height(6.dp))
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(14.dp))

    // 6. AI Vision Scanner Quick Access Banner
    Surface(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp)
        .clickable { onOpenScanner() },
      shape = RoundedCornerShape(24.dp),
      color = AuraSurfaceVariant,
      border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke)
    ) {
      Row(
        modifier = Modifier.padding(18.dp),
        verticalAlignment = Alignment.CenterVertically
      ) {
        Box(
          modifier = Modifier
            .size(46.dp)
            .clip(RoundedCornerShape(14.dp))
            .background(
              Brush.linearGradient(
                colors = listOf(BlushRoseContainer, AuraSurfaceElevated)
              )
            )
            .border(1.dp, BlushRose.copy(alpha = 0.4f), RoundedCornerShape(14.dp)),
          contentAlignment = Alignment.Center
        ) {
          Icon(
            imageVector = Icons.Rounded.CenterFocusStrong,
            contentDescription = null,
            tint = BlushRoseLight,
            modifier = Modifier.size(24.dp)
          )
        }

        Spacer(modifier = Modifier.width(14.dp))

        Column(modifier = Modifier.weight(1f)) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
              text = "AI Vision Scanner",
              style = MaterialTheme.typography.titleSmall,
              color = TextPrimary,
              fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.width(6.dp))
            Surface(
              shape = RoundedCornerShape(6.dp),
              color = SageGreenContainer
            ) {
              Text(
                text = "On-Device",
                style = MaterialTheme.typography.labelSmall,
                color = SageGreenLight,
                fontSize = 9.sp,
                modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
              )
            }
          }
          Spacer(modifier = Modifier.height(2.dp))
          Text(
            text = "Scan facial acne patterns or sanitary flow with local private analysis.",
            style = MaterialTheme.typography.bodySmall,
            color = TextSecondary,
            lineHeight = 16.sp
          )
        }

        Icon(
          imageVector = Icons.Rounded.ChevronRight,
          contentDescription = null,
          tint = TextSecondary,
          modifier = Modifier.size(22.dp)
        )
      }
    }
  }
}
