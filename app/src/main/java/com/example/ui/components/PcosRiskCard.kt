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
import androidx.compose.material.icons.rounded.ArrowForward
import androidx.compose.material.icons.rounded.HealthAndSafety
import androidx.compose.material.icons.rounded.VerifiedUser
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.AssessmentResult
import com.example.data.model.PcosRiskLevel
import com.example.ui.theme.*
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun PcosRiskCard(
  assessmentResult: AssessmentResult,
  onStartAssessment: () -> Unit,
  modifier: Modifier = Modifier
) {
  val riskLevel = assessmentResult.riskLevel
  val riskColor = Color(riskLevel.badgeColorHex)

  val animatedScore by animateFloatAsState(
    targetValue = assessmentResult.scorePercentage.toFloat() / 100f,
    animationSpec = tween(1200),
    label = "PcosScoreGauge"
  )

  Surface(
    modifier = modifier
      .fillMaxWidth()
      .padding(horizontal = 20.dp, vertical = 6.dp),
    shape = RoundedCornerShape(24.dp),
    color = AuraSurface,
    border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke),
    shadowElevation = 4.dp
  ) {
    Box(
      modifier = Modifier
        .fillMaxWidth()
        .background(
          Brush.linearGradient(
            colors = listOf(
              AuraSurfaceElevated.copy(alpha = 0.9f),
              AuraSurface.copy(alpha = 0.95f),
              BlushRoseContainer.copy(alpha = 0.15f)
            )
          )
        )
        .padding(20.dp)
    ) {
      Column {
        // Card Header
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
              modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(BlushRoseContainer)
                .border(1.dp, BlushRose.copy(alpha = 0.3f), RoundedCornerShape(10.dp)),
              contentAlignment = Alignment.Center
            ) {
              Icon(
                imageVector = Icons.Rounded.HealthAndSafety,
                contentDescription = null,
                tint = BlushRose,
                modifier = Modifier.size(20.dp)
              )
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column {
              Text(
                text = "PCOS Risk Assessment",
                style = MaterialTheme.typography.titleMedium,
                color = TextPrimary,
                fontWeight = FontWeight.SemiBold
              )
              Text(
                text = "Rotterdam Diagnostic Framework",
                style = MaterialTheme.typography.labelSmall,
                color = TextSecondary,
                fontSize = 11.sp
              )
            }
          }

          // Risk Badge
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = riskColor.copy(alpha = 0.15f),
            border = androidx.compose.foundation.BorderStroke(1.dp, riskColor.copy(alpha = 0.4f))
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
              verticalAlignment = Alignment.CenterVertically
            ) {
              Box(
                modifier = Modifier
                  .size(6.dp)
                  .clip(CircleShape)
                  .background(riskColor)
              )
              Spacer(modifier = Modifier.width(5.dp))
              Text(
                text = riskLevel.label,
                style = MaterialTheme.typography.labelSmall,
                color = riskColor,
                fontWeight = FontWeight.SemiBold,
                fontSize = 11.sp
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Center Gauge and Score Section
        Row(
          modifier = Modifier.fillMaxWidth(),
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.SpaceBetween
        ) {
          // Semi-Circle Gauge Canvas
          Box(
            modifier = Modifier
              .size(130.dp, 80.dp),
            contentAlignment = Alignment.BottomCenter
          ) {
            Canvas(modifier = Modifier.size(130.dp, 80.dp)) {
              val strokeWidth = 10.dp.toPx()
              val diameter = size.width - strokeWidth
              val topLeft = Offset(strokeWidth / 2, strokeWidth / 2)
              val arcSize = Size(diameter, diameter)

              // Track 180-deg arc (from 180 to 360 deg)
              drawArc(
                color = AuraSurfaceVariant,
                startAngle = 180f,
                sweepAngle = 180f,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
              )

              // Multi-stop risk gradient arc
              val gaugeSweep = animatedScore * 180f
              val gradient = Brush.sweepGradient(
                0.0f to RiskLow,
                0.5f to RiskModerate,
                1.0f to RiskElevated,
                center = Offset(size.width / 2, size.height)
              )

              drawArc(
                brush = Brush.horizontalGradient(
                  colors = listOf(RiskLow, RiskModerate, RiskElevated)
                ),
                startAngle = 180f,
                sweepAngle = gaugeSweep,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
              )

              // Indicator needle dot
              val angleRad = Math.toRadians((180f + gaugeSweep).toDouble())
              val radius = diameter / 2
              val centerX = size.width / 2
              val centerY = size.height
              val dotX = centerX + radius * cos(angleRad).toFloat()
              val dotY = centerY + radius * sin(angleRad).toFloat()

              drawCircle(
                color = TextPrimary,
                radius = strokeWidth * 0.45f,
                center = Offset(dotX, dotY)
              )
            }

            Column(
              horizontalAlignment = Alignment.CenterHorizontally,
              modifier = Modifier.padding(bottom = 2.dp)
            ) {
              Text(
                text = "${assessmentResult.scorePercentage}%",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
              )
              Text(
                text = "Score Index",
                style = MaterialTheme.typography.labelSmall,
                color = TextMuted,
                fontSize = 10.sp
              )
            }
          }

          Spacer(modifier = Modifier.width(16.dp))

          // Key insight text
          Column(modifier = Modifier.weight(1f)) {
            Text(
              text = riskLevel.summary,
              style = MaterialTheme.typography.bodySmall,
              color = TextSecondary,
              lineHeight = 17.sp,
              maxLines = 3
            )
            Spacer(modifier = Modifier.height(6.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
              Icon(
                imageVector = Icons.Rounded.VerifiedUser,
                contentDescription = null,
                tint = SageGreen,
                modifier = Modifier.size(14.dp)
              )
              Spacer(modifier = Modifier.width(4.dp))
              Text(
                text = "5 Clinical Categories Evaluated",
                style = MaterialTheme.typography.labelSmall,
                color = SageGreenLight,
                fontSize = 10.sp
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Action CTA Button
        Button(
          onClick = onStartAssessment,
          modifier = Modifier
            .fillMaxWidth()
            .height(46.dp),
          shape = RoundedCornerShape(16.dp),
          colors = ButtonDefaults.buttonColors(
            containerColor = BlushRose,
            contentColor = TextOnAccent
          ),
          elevation = ButtonDefaults.buttonElevation(defaultElevation = 2.dp)
        ) {
          Text(
            text = "Start Risk Assessment",
            style = MaterialTheme.typography.labelLarge,
            fontWeight = FontWeight.SemiBold
          )
          Spacer(modifier = Modifier.width(8.dp))
          Icon(
            imageVector = Icons.Rounded.ArrowForward,
            contentDescription = null,
            modifier = Modifier.size(18.dp)
          )
        }
      }
    }
  }
}
