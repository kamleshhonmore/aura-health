package com.example.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.material.icons.rounded.WaterDrop
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.CycleInfo
import com.example.ui.theme.*
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun CycleProgressRing(
  cycleInfo: CycleInfo,
  onLogClick: () -> Unit,
  modifier: Modifier = Modifier
) {
  val targetProgress = cycleInfo.currentCycleDay.toFloat() / cycleInfo.totalCycleDays.toFloat()
  val animatedProgress by animateFloatAsState(
    targetValue = targetProgress,
    animationSpec = tween(durationMillis = 1000),
    label = "CycleRingProgress"
  )

  Box(
    modifier = modifier
      .fillMaxWidth()
      .padding(horizontal = 20.dp, vertical = 8.dp),
    contentAlignment = Alignment.Center
  ) {
    // Outer glow ambient background
    Box(
      modifier = Modifier
        .size(290.dp)
        .clip(CircleShape)
        .background(
          Brush.radialGradient(
            colors = listOf(
              BlushRose.copy(alpha = 0.08f),
              SageGreen.copy(alpha = 0.04f),
              Color.Transparent
            )
          )
        )
    )

    // Canvas Progress Ring
    Canvas(modifier = Modifier.size(270.dp)) {
      val strokeWidth = 14.dp.toPx()
      val diameter = size.minDimension - strokeWidth
      val topLeft = Offset((size.width - diameter) / 2, (size.height - diameter) / 2)
      val arcSize = Size(diameter, diameter)
      val startAngle = -90f

      // Track background ring
      drawArc(
        color = AuraSurfaceVariant.copy(alpha = 0.7f),
        startAngle = 0f,
        sweepAngle = 360f,
        useCenter = false,
        topLeft = topLeft,
        size = arcSize,
        style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
      )

      // Phase segments markers (subtle background zones)
      // Menstrual: Days 1-5 (5/28 * 360 = 64.2 deg)
      val menstrualSweep = (5f / 28f) * 360f
      drawArc(
        color = BlushRoseDark.copy(alpha = 0.35f),
        startAngle = startAngle,
        sweepAngle = menstrualSweep,
        useCenter = false,
        topLeft = topLeft,
        size = arcSize,
        style = Stroke(width = strokeWidth * 0.7f, cap = StrokeCap.Butt)
      )

      // Ovulation Zone: Days 13-16 (4/28 * 360 = 51.4 deg)
      val ovulationStart = startAngle + (12f / 28f) * 360f
      val ovulationSweep = (4f / 28f) * 360f
      drawArc(
        color = SageGreenDark.copy(alpha = 0.4f),
        startAngle = ovulationStart,
        sweepAngle = ovulationSweep,
        useCenter = false,
        topLeft = topLeft,
        size = arcSize,
        style = Stroke(width = strokeWidth * 0.7f, cap = StrokeCap.Butt)
      )

      // Active Gradient Progress Arc
      val sweepAngle = animatedProgress * 360f
      val gradientBrush = Brush.sweepGradient(
        colors = listOf(
          BlushRose,
          ChampagneGold,
          SageGreen,
          BlushRose
        ),
        center = Offset(size.width / 2, size.height / 2)
      )

      drawArc(
        brush = gradientBrush,
        startAngle = startAngle,
        sweepAngle = sweepAngle,
        useCenter = false,
        topLeft = topLeft,
        size = arcSize,
        style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
      )

      // Indicator Head Glow Point
      val currentAngleRad = Math.toRadians((startAngle + sweepAngle).toDouble())
      val radius = diameter / 2
      val centerX = size.width / 2
      val centerY = size.height / 2
      val dotX = centerX + radius * cos(currentAngleRad).toFloat()
      val dotY = centerY + radius * sin(currentAngleRad).toFloat()

      // Glow halo
      drawCircle(
        color = BlushRoseLight.copy(alpha = 0.3f),
        radius = strokeWidth * 0.9f,
        center = Offset(dotX, dotY)
      )
      // Solid center dot
      drawCircle(
        color = TextPrimary,
        radius = strokeWidth * 0.45f,
        center = Offset(dotX, dotY)
      )
    }

    // Inside Ring Content Card
    Column(
      modifier = Modifier
        .width(220.dp)
        .padding(horizontal = 8.dp),
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.Center
    ) {
      Text(
        text = "NEXT PERIOD IN",
        style = MaterialTheme.typography.labelSmall,
        color = TextSecondary,
        letterSpacing = 1.5.sp,
        fontWeight = FontWeight.SemiBold
      )

      Spacer(modifier = Modifier.height(2.dp))

      Row(
        verticalAlignment = Alignment.Bottom,
        horizontalArrangement = Arrangement.Center
      ) {
        Text(
          text = "${cycleInfo.daysUntilPeriod}",
          style = MaterialTheme.typography.displayMedium,
          fontWeight = FontWeight.Light,
          color = TextPrimary,
          fontSize = 44.sp,
          lineHeight = 44.sp
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
          text = "Days",
          style = MaterialTheme.typography.titleMedium,
          color = BlushRose,
          modifier = Modifier.padding(bottom = 6.dp)
        )
      }

      // Conception probability chip
      Surface(
        shape = RoundedCornerShape(10.dp),
        color = ChampagneGoldContainer,
        border = androidx.compose.foundation.BorderStroke(1.dp, ChampagneGold.copy(alpha = 0.3f)),
        modifier = Modifier.padding(vertical = 4.dp)
      ) {
        Row(
          modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Box(
            modifier = Modifier
              .size(6.dp)
              .clip(CircleShape)
              .background(ChampagneGold)
          )
          Spacer(modifier = Modifier.width(5.dp))
          Text(
            text = "Conception: ${cycleInfo.conceptionProbability}",
            style = MaterialTheme.typography.labelSmall,
            color = ChampagneGoldLight,
            fontSize = 10.sp
          )
        }
      }

      Spacer(modifier = Modifier.height(8.dp))

      // Embedded "+ Log Daily Symptoms" Button
      Button(
        onClick = onLogClick,
        colors = ButtonDefaults.buttonColors(
          containerColor = BlushRoseContainer,
          contentColor = BlushRoseLight
        ),
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, BlushRose.copy(alpha = 0.4f)),
        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp),
        modifier = Modifier.height(34.dp)
      ) {
        Icon(
          imageVector = Icons.Rounded.Add,
          contentDescription = null,
          tint = BlushRoseLight,
          modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
          text = "Log Daily Symptoms",
          style = MaterialTheme.typography.labelMedium,
          fontWeight = FontWeight.SemiBold,
          fontSize = 11.sp
        )
      }
    }
  }
}
