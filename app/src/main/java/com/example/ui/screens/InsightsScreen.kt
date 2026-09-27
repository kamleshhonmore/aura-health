package com.example.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.*
import com.example.ui.theme.*
import com.example.ui.viewmodel.AuraUiState

@Composable
fun InsightsScreen(
  uiState: AuraUiState,
  onSelectDay: (PredictiveDay) -> Unit,
  onSelectMonth: (String) -> Unit,
  modifier: Modifier = Modifier
) {
  val scrollState = rememberScrollState()
  val filteredDays = uiState.predictiveDays.filter { it.monthName == uiState.selectedMonthFilter }
  val selectedDay = uiState.selectedDay ?: uiState.predictiveDays.firstOrNull()

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(AuraBackground)
      .verticalScroll(scrollState)
      .padding(bottom = 24.dp)
  ) {
    // Header
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp, vertical = 14.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Column {
        Text(
          text = "Insights & Trends",
          style = MaterialTheme.typography.headlineSmall,
          color = TextPrimary,
          fontWeight = FontWeight.SemiBold
        )
        Text(
          text = "90-Day Predictive Forecasting",
          style = MaterialTheme.typography.labelSmall,
          color = TextSecondary
        )
      }

      Surface(
        shape = RoundedCornerShape(12.dp),
        color = SageGreenContainer,
        border = androidx.compose.foundation.BorderStroke(1.dp, SageGreen.copy(alpha = 0.3f))
      ) {
        Row(
          modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Icon(
            imageVector = Icons.Rounded.ShowChart,
            contentDescription = null,
            tint = SageGreenLight,
            modifier = Modifier.size(14.dp)
          )
          Spacer(modifier = Modifier.width(4.dp))
          Text(
            text = "94% Regularity",
            style = MaterialTheme.typography.labelSmall,
            color = SageGreenLight,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold
          )
        }
      }
    }

    Spacer(modifier = Modifier.height(6.dp))

    // 1. Month Switcher Selector
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp),
      horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      listOf("OCT", "NOV", "DEC", "JAN").forEach { month ->
        val isSelected = uiState.selectedMonthFilter == month
        Surface(
          shape = RoundedCornerShape(14.dp),
          color = if (isSelected) BlushRoseContainer else AuraSurfaceVariant,
          border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isSelected) BlushRose else GlassStroke
          ),
          modifier = Modifier
            .weight(1f)
            .clip(RoundedCornerShape(14.dp))
            .clickable { onSelectMonth(month) }
        ) {
          Text(
            text = month,
            style = MaterialTheme.typography.labelMedium,
            color = if (isSelected) BlushRoseLight else TextSecondary,
            fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(vertical = 8.dp)
          )
        }
      }
    }

    Spacer(modifier = Modifier.height(14.dp))

    // 2. 90-Day Predictive Calendar Grid Card (24dp rounded Material 3)
    Surface(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp),
      shape = RoundedCornerShape(24.dp),
      color = AuraSurface,
      border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke)
    ) {
      Column(modifier = Modifier.padding(18.dp)) {
        // Weekday header
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween
        ) {
          listOf("S", "M", "T", "W", "T", "F", "S").forEach { dayLabel ->
            Text(
              text = dayLabel,
              style = MaterialTheme.typography.labelSmall,
              color = TextMuted,
              fontWeight = FontWeight.Bold,
              textAlign = TextAlign.Center,
              modifier = Modifier.width(36.dp)
            )
          }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Days Grid
        val chunkedDays = filteredDays.chunked(7)
        chunkedDays.forEach { week ->
          Row(
            modifier = Modifier
              .fillMaxWidth()
              .padding(vertical = 3.dp),
            horizontalArrangement = Arrangement.SpaceBetween
          ) {
            week.forEach { day ->
              val isSelected = selectedDay?.dateString == day.dateString
              val dayColor = when (day.type) {
                CalendarDayType.PERIOD_LOGGED -> BlushRose
                CalendarDayType.PERIOD_PREDICTED -> BlushRose.copy(alpha = 0.65f)
                CalendarDayType.OVULATION_PEAK -> SageGreen
                CalendarDayType.FERTILE_WINDOW -> ChampagneGold
                CalendarDayType.TODAY -> TextPrimary
                else -> Color.Transparent
              }

              val bg = when {
                isSelected -> BlushRoseContainer
                day.type == CalendarDayType.TODAY -> AuraSurfaceElevated
                day.type == CalendarDayType.PERIOD_LOGGED -> BlushRoseDark.copy(alpha = 0.5f)
                day.type == CalendarDayType.PERIOD_PREDICTED -> BlushRoseDark.copy(alpha = 0.25f)
                day.type == CalendarDayType.OVULATION_PEAK -> SageGreenDark.copy(alpha = 0.5f)
                day.type == CalendarDayType.FERTILE_WINDOW -> ChampagneGoldDark.copy(alpha = 0.35f)
                else -> Color.Transparent
              }

              Box(
                modifier = Modifier
                  .size(36.dp)
                  .clip(CircleShape)
                  .background(bg)
                  .border(
                    width = if (isSelected) 1.5.dp else if (day.type == CalendarDayType.TODAY) 1.dp else 0.dp,
                    color = if (isSelected) BlushRose else if (day.type == CalendarDayType.TODAY) SageGreen else Color.Transparent,
                    shape = CircleShape
                  )
                  .clickable { onSelectDay(day) },
                contentAlignment = Alignment.Center
              ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                  Text(
                    text = "${day.dayOfMonth}",
                    style = MaterialTheme.typography.labelSmall,
                    color = if (day.type == CalendarDayType.TODAY || isSelected) TextPrimary else TextSecondary,
                    fontWeight = if (isSelected || day.type == CalendarDayType.TODAY) FontWeight.Bold else FontWeight.Normal,
                    fontSize = 11.sp
                  )
                  if (dayColor != Color.Transparent) {
                    Box(
                      modifier = Modifier
                        .size(4.dp)
                        .clip(CircleShape)
                        .background(dayColor)
                    )
                  }
                }
              }
            }
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Legend row
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          LegendItem(color = BlushRose, label = "Period")
          LegendItem(color = ChampagneGold, label = "Fertile")
          LegendItem(color = SageGreen, label = "Ovulation")
          LegendItem(color = TextMuted, label = "Follicular/Luteal")
        }
      }
    }

    Spacer(modifier = Modifier.height(14.dp))

    // 3. Selected Day Breakdown Card
    if (selectedDay != null) {
      Surface(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 20.dp),
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
              .size(44.dp)
              .clip(CircleShape)
              .background(BlushRoseContainer)
              .border(1.dp, BlushRose.copy(alpha = 0.3f), CircleShape),
            contentAlignment = Alignment.Center
          ) {
            Text(
              text = "D${selectedDay.cycleDay}",
              style = MaterialTheme.typography.titleSmall,
              color = BlushRoseLight,
              fontWeight = FontWeight.Bold
            )
          }

          Spacer(modifier = Modifier.width(14.dp))

          Column(modifier = Modifier.weight(1f)) {
            Text(
              text = "${selectedDay.dateString} • Cycle Day ${selectedDay.cycleDay}",
              style = MaterialTheme.typography.titleSmall,
              color = TextPrimary,
              fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
              text = selectedDay.symptomNotes ?: "Standard follicular phase balance. No adverse symptoms logged.",
              style = MaterialTheme.typography.bodySmall,
              color = TextSecondary,
              lineHeight = 16.sp
            )
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(16.dp))

    // 4. Historical Symptom & Biomarker Correlation Chart
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
            Icon(
              imageVector = Icons.Rounded.Timeline,
              contentDescription = null,
              tint = ChampagneGold,
              modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
              text = "Energy vs Cramp Severity Curve",
              style = MaterialTheme.typography.titleSmall,
              color = TextPrimary,
              fontWeight = FontWeight.SemiBold
            )
          }
        }

        Spacer(modifier = Modifier.height(4.dp))
        Text(
          text = "Correlation over 28-day physiological cycle",
          style = MaterialTheme.typography.labelSmall,
          color = TextSecondary
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Custom Canvas Chart
        Box(
          modifier = Modifier
            .fillMaxWidth()
            .height(130.dp)
        ) {
          Canvas(modifier = Modifier.fillMaxSize()) {
            val w = size.width
            val h = size.height
            val points = uiState.historicalTrends
            if (points.size < 2) return@Canvas

            val stepX = w / (points.size - 1)

            // Draw grid guidelines
            for (i in 1..3) {
              val y = h * (i / 4f)
              drawLine(
                color = AuraSurfaceVariant,
                start = Offset(0f, y),
                end = Offset(w, y),
                strokeWidth = 1.dp.toPx()
              )
            }

            // Energy Curve (Sage Green / Champagne Gold)
            val energyPath = Path()
            points.forEachIndexed { i, p ->
              val x = i * stepX
              val y = h - (p.secondaryValue / 100f) * (h - 20) - 10
              if (i == 0) energyPath.moveTo(x, y) else energyPath.lineTo(x, y)
            }
            drawPath(
              path = energyPath,
              color = SageGreen,
              style = Stroke(width = 2.5.dp.toPx(), cap = StrokeCap.Round)
            )

            // Cramps Curve (Blush Rose)
            val crampsPath = Path()
            points.forEachIndexed { i, p ->
              val x = i * stepX
              val y = h - (p.value / 100f) * (h - 20) - 10
              if (i == 0) crampsPath.moveTo(x, y) else crampsPath.lineTo(x, y)
            }
            drawPath(
              path = crampsPath,
              color = BlushRose,
              style = Stroke(width = 2.5.dp.toPx(), cap = StrokeCap.Round)
            )

            // Points on curves
            points.forEachIndexed { i, p ->
              val x = i * stepX
              val yCramps = h - (p.value / 100f) * (h - 20) - 10
              val yEnergy = h - (p.secondaryValue / 100f) * (h - 20) - 10
              drawCircle(color = BlushRose, radius = 3.dp.toPx(), center = Offset(x, yCramps))
              drawCircle(color = SageGreen, radius = 3.dp.toPx(), center = Offset(x, yEnergy))
            }
          }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Chart legend
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.Center,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(SageGreen))
          Spacer(modifier = Modifier.width(5.dp))
          Text(text = "Energy Index", style = MaterialTheme.typography.labelSmall, color = SageGreenLight)

          Spacer(modifier = Modifier.width(20.dp))

          Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(BlushRose))
          Spacer(modifier = Modifier.width(5.dp))
          Text(text = "Cramps Level", style = MaterialTheme.typography.labelSmall, color = BlushRoseLight)
        }
      }
    }

    Spacer(modifier = Modifier.height(16.dp))

    // 5. Cycle History & Health Parameters Card
    Surface(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp),
      shape = RoundedCornerShape(24.dp),
      color = AuraSurface,
      border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke)
    ) {
      Column(modifier = Modifier.padding(20.dp)) {
        Text(
          text = "Clinical Cycle Parameters",
          style = MaterialTheme.typography.titleMedium,
          color = TextPrimary,
          fontWeight = FontWeight.SemiBold
        )

        Spacer(modifier = Modifier.height(14.dp))

        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
          StatCardItem(
            title = "Avg Cycle",
            value = "${uiState.cycleSummary.averageCycleLengthDays} Days",
            subtitle = "±${uiState.cycleSummary.cycleVariationDays}d variation",
            modifier = Modifier.weight(1f)
          )

          StatCardItem(
            title = "Avg Period",
            value = "${uiState.cycleSummary.averagePeriodDays} Days",
            subtitle = "5 Tracked Cycles",
            modifier = Modifier.weight(1f)
          )

          StatCardItem(
            title = "Regularity",
            value = "${uiState.cycleSummary.regularCyclesPercentage}%",
            subtitle = "High Predictability",
            modifier = Modifier.weight(1f)
          )
        }
      }
    }
  }
}

@Composable
fun LegendItem(color: Color, label: String) {
  Row(verticalAlignment = Alignment.CenterVertically) {
    Box(
      modifier = Modifier
        .size(6.dp)
        .clip(CircleShape)
        .background(color)
    )
    Spacer(modifier = Modifier.width(4.dp))
    Text(
      text = label,
      style = MaterialTheme.typography.labelSmall,
      color = TextSecondary,
      fontSize = 10.sp
    )
  }
}

@Composable
fun StatCardItem(
  title: String,
  value: String,
  subtitle: String,
  modifier: Modifier = Modifier
) {
  Surface(
    shape = RoundedCornerShape(16.dp),
    color = AuraSurfaceVariant,
    border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke),
    modifier = modifier
  ) {
    Column(modifier = Modifier.padding(12.dp)) {
      Text(
        text = title,
        style = MaterialTheme.typography.labelSmall,
        color = TextMuted,
        fontSize = 10.sp
      )
      Spacer(modifier = Modifier.height(4.dp))
      Text(
        text = value,
        style = MaterialTheme.typography.titleMedium,
        color = TextPrimary,
        fontWeight = FontWeight.Bold
      )
      Spacer(modifier = Modifier.height(2.dp))
      Text(
        text = subtitle,
        style = MaterialTheme.typography.bodySmall,
        color = SageGreenLight,
        fontSize = 10.sp
      )
    }
  }
}
