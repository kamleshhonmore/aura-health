package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.*
import com.example.ui.theme.*
import com.example.ui.viewmodel.AuraUiState

@Composable
fun PcosScreen(
  uiState: AuraUiState,
  onStartQuiz: () -> Unit,
  onSelectOption: (QuizQuestion, String) -> Unit,
  onNextQuestion: () -> Unit,
  onPreviousQuestion: () -> Unit,
  onSubmitQuiz: () -> Unit,
  onRetakeQuiz: () -> Unit,
  modifier: Modifier = Modifier
) {
  Column(
    modifier = modifier
      .fillMaxSize()
      .background(AuraBackground)
  ) {
    if (uiState.isTakingQuiz && uiState.quizQuestions.isNotEmpty()) {
      // Taking Quiz View
      QuizQuestionnaireView(
        uiState = uiState,
        onSelectOption = onSelectOption,
        onNext = onNextQuestion,
        onPrevious = onPreviousQuestion,
        onSubmit = onSubmitQuiz
      )
    } else {
      // Risk Assessment Results / Overview View
      PcosResultView(
        result = uiState.pcosResult,
        onRetake = onRetakeQuiz
      )
    }
  }
}

@Composable
fun QuizQuestionnaireView(
  uiState: AuraUiState,
  onSelectOption: (QuizQuestion, String) -> Unit,
  onNext: () -> Unit,
  onPrevious: () -> Unit,
  onSubmit: () -> Unit
) {
  val questions = uiState.quizQuestions
  val currentIndex = uiState.currentQuestionIndex.coerceIn(0, questions.size - 1)
  val currentQuestion = questions[currentIndex]
  val progress = (currentIndex + 1).toFloat() / questions.size.toFloat()
  val isLastQuestion = currentIndex == questions.size - 1

  val hasSelectionForCurrent = currentQuestion.options.any { opt ->
    uiState.selectedOptionIds.contains(opt.id)
  }

  Column(
    modifier = Modifier
      .fillMaxSize()
      .padding(horizontal = 20.dp, vertical = 14.dp)
  ) {
    // Header & Top Progress Bar
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Text(
        text = "PCOS Risk Assessment",
        style = MaterialTheme.typography.titleMedium,
        color = TextPrimary,
        fontWeight = FontWeight.SemiBold
      )
      Surface(
        shape = RoundedCornerShape(10.dp),
        color = AuraSurfaceVariant
      ) {
        Text(
          text = "Step ${currentIndex + 1} of ${questions.size}",
          style = MaterialTheme.typography.labelSmall,
          color = BlushRose,
          fontWeight = FontWeight.SemiBold,
          modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
        )
      }
    }

    Spacer(modifier = Modifier.height(12.dp))

    // Animated Top Progress Indicator
    LinearProgressIndicator(
      progress = { progress },
      modifier = Modifier
        .fillMaxWidth()
        .height(6.dp)
        .clip(RoundedCornerShape(3.dp)),
      color = BlushRose,
      trackColor = AuraSurfaceVariant
    )

    Spacer(modifier = Modifier.height(20.dp))

    // Scrollable Question Content
    Column(
      modifier = Modifier
        .weight(1f)
        .verticalScroll(rememberScrollState())
    ) {
      // Category Tag
      Surface(
        shape = RoundedCornerShape(8.dp),
        color = SageGreenContainer,
        border = androidx.compose.foundation.BorderStroke(1.dp, SageGreen.copy(alpha = 0.3f))
      ) {
        Text(
          text = currentQuestion.category.uppercase(),
          style = MaterialTheme.typography.labelSmall,
          color = SageGreenLight,
          letterSpacing = 1.sp,
          fontSize = 10.sp,
          modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
        )
      }

      Spacer(modifier = Modifier.height(10.dp))

      Text(
        text = currentQuestion.title,
        style = MaterialTheme.typography.titleLarge,
        color = TextPrimary,
        fontWeight = FontWeight.SemiBold,
        lineHeight = 28.sp
      )

      Spacer(modifier = Modifier.height(8.dp))

      Text(
        text = currentQuestion.explanation,
        style = MaterialTheme.typography.bodyMedium,
        color = TextSecondary,
        lineHeight = 20.sp
      )

      if (currentQuestion.isMultiSelect) {
        Spacer(modifier = Modifier.height(8.dp))
        Text(
          text = "• Select all that apply",
          style = MaterialTheme.typography.labelSmall,
          color = ChampagneGold
        )
      }

      Spacer(modifier = Modifier.height(20.dp))

      // Options
      Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        currentQuestion.options.forEach { option ->
          val isSelected = uiState.selectedOptionIds.contains(option.id)

          Surface(
            shape = RoundedCornerShape(20.dp),
            color = if (isSelected) BlushRoseContainer else AuraSurface,
            border = androidx.compose.foundation.BorderStroke(
              1.dp,
              if (isSelected) BlushRose else GlassStroke
            ),
            modifier = Modifier
              .fillMaxWidth()
              .clip(RoundedCornerShape(20.dp))
              .clickable { onSelectOption(currentQuestion, option.id) }
          ) {
            Row(
              modifier = Modifier.padding(16.dp),
              verticalAlignment = Alignment.CenterVertically
            ) {
              Box(
                modifier = Modifier
                  .size(24.dp)
                  .clip(CircleShape)
                  .background(if (isSelected) BlushRose else AuraSurfaceVariant)
                  .border(
                    1.dp,
                    if (isSelected) BlushRose else TextMuted,
                    CircleShape
                  ),
                contentAlignment = Alignment.Center
              ) {
                if (isSelected) {
                  Icon(
                    imageVector = Icons.Rounded.Check,
                    contentDescription = null,
                    tint = TextOnAccent,
                    modifier = Modifier.size(16.dp)
                  )
                }
              }

              Spacer(modifier = Modifier.width(14.dp))

              Column(modifier = Modifier.weight(1f)) {
                Text(
                  text = option.title,
                  style = MaterialTheme.typography.labelLarge,
                  color = if (isSelected) TextPrimary else TextPrimary,
                  fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                )
                if (option.subtitle.isNotEmpty()) {
                  Spacer(modifier = Modifier.height(2.dp))
                  Text(
                    text = option.subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary,
                    fontSize = 12.sp
                  )
                }
              }
            }
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(16.dp))

    // Navigation Buttons Row
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(bottom = 12.dp),
      horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
      if (currentIndex > 0) {
        OutlinedButton(
          onClick = onPrevious,
          shape = RoundedCornerShape(16.dp),
          colors = ButtonDefaults.outlinedButtonColors(contentColor = TextSecondary),
          border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke),
          modifier = Modifier
            .weight(1f)
            .height(48.dp)
        ) {
          Icon(
            imageVector = Icons.Rounded.ArrowBack,
            contentDescription = null,
            modifier = Modifier.size(18.dp)
          )
          Spacer(modifier = Modifier.width(6.dp))
          Text(text = "Previous", style = MaterialTheme.typography.labelLarge)
        }
      }

      Button(
        onClick = if (isLastQuestion) onSubmit else onNext,
        enabled = hasSelectionForCurrent,
        shape = RoundedCornerShape(16.dp),
        colors = ButtonDefaults.buttonColors(
          containerColor = BlushRose,
          contentColor = TextOnAccent,
          disabledContainerColor = AuraSurfaceVariant,
          disabledContentColor = TextMuted
        ),
        modifier = Modifier
          .weight(if (currentIndex > 0) 1.5f else 1f)
          .height(48.dp)
      ) {
        Text(
          text = if (isLastQuestion) "Calculate Risk Index" else "Next Step",
          style = MaterialTheme.typography.labelLarge,
          fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.width(6.dp))
        Icon(
          imageVector = if (isLastQuestion) Icons.Rounded.Done else Icons.Rounded.ArrowForward,
          contentDescription = null,
          modifier = Modifier.size(18.dp)
        )
      }
    }
  }
}

@Composable
fun PcosResultView(
  result: AssessmentResult,
  onRetake: () -> Unit
) {
  val riskLevel = result.riskLevel
  val riskColor = Color(riskLevel.badgeColorHex)
  val scrollState = rememberScrollState()

  Column(
    modifier = Modifier
      .fillMaxSize()
      .verticalScroll(scrollState)
      .padding(horizontal = 20.dp, vertical = 14.dp)
      .padding(bottom = 24.dp)
  ) {
    // Header
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Column {
        Text(
          text = "PCOS Risk Assessment",
          style = MaterialTheme.typography.headlineSmall,
          color = TextPrimary,
          fontWeight = FontWeight.SemiBold
        )
        Text(
          text = "Evidence-Based Clinical Profile",
          style = MaterialTheme.typography.labelSmall,
          color = TextSecondary
        )
      }

      Button(
        onClick = onRetake,
        colors = ButtonDefaults.buttonColors(
          containerColor = AuraSurfaceVariant,
          contentColor = TextPrimary
        ),
        shape = RoundedCornerShape(14.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke),
        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
        modifier = Modifier.height(36.dp)
      ) {
        Icon(
          imageVector = Icons.Rounded.Refresh,
          contentDescription = null,
          tint = BlushRose,
          modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(text = "Retake", style = MaterialTheme.typography.labelMedium, fontSize = 12.sp)
      }
    }

    Spacer(modifier = Modifier.height(18.dp))

    // 1. Dynamic Risk Score Gauge & Status Card (24dp rounded Material 3)
    Surface(
      shape = RoundedCornerShape(24.dp),
      color = AuraSurface,
      border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke),
      modifier = Modifier.fillMaxWidth()
    ) {
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .background(
            Brush.verticalGradient(
              colors = listOf(
                AuraSurfaceElevated,
                AuraSurface
              )
            )
          )
          .padding(24.dp)
      ) {
        Column(
          horizontalAlignment = Alignment.CenterHorizontally,
          modifier = Modifier.fillMaxWidth()
        ) {
          // Risk Level Pill Badge
          Surface(
            shape = RoundedCornerShape(16.dp),
            color = riskColor.copy(alpha = 0.15f),
            border = androidx.compose.foundation.BorderStroke(1.dp, riskColor.copy(alpha = 0.5f))
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp),
              verticalAlignment = Alignment.CenterVertically
            ) {
              Box(
                modifier = Modifier
                  .size(8.dp)
                  .clip(CircleShape)
                  .background(riskColor)
              )
              Spacer(modifier = Modifier.width(8.dp))
              Text(
                text = "${riskLevel.label} (${result.scorePercentage}%)",
                style = MaterialTheme.typography.titleSmall,
                color = riskColor,
                fontWeight = FontWeight.SemiBold
              )
            }
          }

          Spacer(modifier = Modifier.height(16.dp))

          // Score Gauge Number
          Text(
            text = "${result.scorePercentage}",
            style = MaterialTheme.typography.displayLarge,
            fontWeight = FontWeight.Light,
            color = TextPrimary
          )
          Text(
            text = "Risk Probability Index (0–100%)",
            style = MaterialTheme.typography.labelSmall,
            color = TextSecondary
          )

          Spacer(modifier = Modifier.height(16.dp))

          // Linear multi-zone indicator
          LinearProgressIndicator(
            progress = { result.scorePercentage / 100f },
            modifier = Modifier
              .fillMaxWidth()
              .height(8.dp)
              .clip(RoundedCornerShape(4.dp)),
            color = riskColor,
            trackColor = AuraSurfaceVariant
          )

          Spacer(modifier = Modifier.height(14.dp))

          Text(
            text = riskLevel.summary,
            style = MaterialTheme.typography.bodyMedium,
            color = TextSecondary,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp
          )
        }
      }
    }

    Spacer(modifier = Modifier.height(16.dp))

    // 2. Rotterdam Consensus Criteria Breakdown
    Surface(
      shape = RoundedCornerShape(24.dp),
      color = AuraSurface,
      border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke),
      modifier = Modifier.fillMaxWidth()
    ) {
      Column(modifier = Modifier.padding(20.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(
            imageVector = Icons.Rounded.Verified,
            contentDescription = null,
            tint = SageGreen,
            modifier = Modifier.size(20.dp)
          )
          Spacer(modifier = Modifier.width(8.dp))
          Text(
            text = "Rotterdam Diagnostic Indicators",
            style = MaterialTheme.typography.titleMedium,
            color = TextPrimary,
            fontWeight = FontWeight.SemiBold
          )
        }

        Spacer(modifier = Modifier.height(12.dp))

        result.rotterdamCriteriaMatched.forEach { item ->
          Row(
            modifier = Modifier.padding(vertical = 4.dp),
            verticalAlignment = Alignment.Top
          ) {
            Icon(
              imageVector = Icons.Rounded.CheckCircleOutline,
              contentDescription = null,
              tint = SageGreenLight,
              modifier = Modifier
                .size(16.dp)
                .padding(top = 2.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
              text = item,
              style = MaterialTheme.typography.bodyMedium,
              color = TextPrimary,
              fontSize = 13.sp
            )
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(16.dp))

    // 3. Recommended Next Steps Checklist
    Surface(
      shape = RoundedCornerShape(24.dp),
      color = AuraSurface,
      border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke),
      modifier = Modifier.fillMaxWidth()
    ) {
      Column(modifier = Modifier.padding(20.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(
            imageVector = Icons.Rounded.AssignmentTurnedIn,
            contentDescription = null,
            tint = BlushRose,
            modifier = Modifier.size(20.dp)
          )
          Spacer(modifier = Modifier.width(8.dp))
          Text(
            text = "Personalized Action Plan",
            style = MaterialTheme.typography.titleMedium,
            color = TextPrimary,
            fontWeight = FontWeight.SemiBold
          )
        }

        Spacer(modifier = Modifier.height(12.dp))

        result.recommendedNextSteps.forEachIndexed { idx, step ->
          Row(
            modifier = Modifier.padding(vertical = 5.dp),
            verticalAlignment = Alignment.Top
          ) {
            Box(
              modifier = Modifier
                .size(20.dp)
                .clip(CircleShape)
                .background(BlushRoseContainer),
              contentAlignment = Alignment.Center
            ) {
              Text(
                text = "${idx + 1}",
                style = MaterialTheme.typography.labelSmall,
                color = BlushRoseLight,
                fontWeight = FontWeight.Bold,
                fontSize = 10.sp
              )
            }
            Spacer(modifier = Modifier.width(10.dp))
            Text(
              text = step,
              style = MaterialTheme.typography.bodyMedium,
              color = TextSecondary,
              fontSize = 13.sp,
              lineHeight = 18.sp
            )
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(16.dp))

    // 4. Questions for your Doctor / OB-GYN
    Surface(
      shape = RoundedCornerShape(24.dp),
      color = AuraSurface,
      border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke),
      modifier = Modifier.fillMaxWidth()
    ) {
      Column(modifier = Modifier.padding(20.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(
            imageVector = Icons.Rounded.QuestionAnswer,
            contentDescription = null,
            tint = ChampagneGold,
            modifier = Modifier.size(20.dp)
          )
          Spacer(modifier = Modifier.width(8.dp))
          Text(
            text = "Questions for Your Doctor / OB-GYN",
            style = MaterialTheme.typography.titleMedium,
            color = TextPrimary,
            fontWeight = FontWeight.SemiBold
          )
        }

        Spacer(modifier = Modifier.height(12.dp))

        result.doctorDiscussionPoints.forEach { q ->
          Surface(
            shape = RoundedCornerShape(12.dp),
            color = AuraSurfaceVariant,
            modifier = Modifier
              .fillMaxWidth()
              .padding(vertical = 4.dp)
          ) {
            Text(
              text = "“$q”",
              style = MaterialTheme.typography.bodySmall,
              color = TextPrimary,
              modifier = Modifier.padding(12.dp),
              lineHeight = 18.sp
            )
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(16.dp))

    // 5. Mandatory Medical Disclaimer Card
    Surface(
      shape = RoundedCornerShape(20.dp),
      color = AuraSurfaceVariant,
      border = androidx.compose.foundation.BorderStroke(1.dp, TextMuted.copy(alpha = 0.3f)),
      modifier = Modifier.fillMaxWidth()
    ) {
      Row(
        modifier = Modifier.padding(16.dp),
        verticalAlignment = Alignment.Top
      ) {
        Icon(
          imageVector = Icons.Rounded.Info,
          contentDescription = null,
          tint = TextMuted,
          modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.width(10.dp))
        Text(
          text = result.disclaimer,
          style = MaterialTheme.typography.bodySmall,
          color = TextMuted,
          fontSize = 11.sp,
          lineHeight = 16.sp
        )
      }
    }
  }
}
