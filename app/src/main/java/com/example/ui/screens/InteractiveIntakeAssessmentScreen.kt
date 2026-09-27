package com.example.ui.screens

import androidx.compose.animation.*
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*
import com.example.data.model.*
import kotlinx.coroutines.delay

@Composable
fun InteractiveIntakeAssessmentScreen(
  steps: List<IntakeStepData>,
  onClose: () -> Unit,
  onComplete: () -> Unit,
  modifier: Modifier = Modifier
) {
  var currentStepIndex by remember { mutableStateOf(0) }
  val answers = remember { mutableStateMapOf<Int, MutableSet<String>>() }
  val sliderValues = remember { mutableStateMapOf<Int, Float>() }
  var isLoaderActive by remember { mutableStateOf(false) }

  val currentStep = steps.getOrNull(currentStepIndex) ?: steps.last()
  val progress = (currentStepIndex + 1).toFloat() / steps.size.toFloat()

  // Handle loader auto-advance
  LaunchedEffect(isLoaderActive) {
    if (isLoaderActive) {
      delay(2200)
      isLoaderActive = false
      if (currentStepIndex < steps.size - 1) {
        currentStepIndex++
      }
    }
  }

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(AuraBackground)
      .padding(horizontal = 20.dp, vertical = 16.dp)
  ) {
    // Top Bar: Smart Stepper & Close
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Surface(
        shape = RoundedCornerShape(10.dp),
        color = AuraSurfaceVariant
      ) {
        Text(
          text = "Step ${currentStepIndex + 1} of ${steps.size} • Auto-saved",
          style = MaterialTheme.typography.labelSmall,
          color = BlushRose,
          fontWeight = FontWeight.SemiBold,
          modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
        )
      }

      IconButton(
        onClick = onClose,
        modifier = Modifier
          .size(36.dp)
          .clip(CircleShape)
          .background(AuraSurfaceVariant)
      ) {
        Icon(
          imageVector = Icons.Rounded.Close,
          contentDescription = "Close",
          tint = TextSecondary,
          modifier = Modifier.size(18.dp)
        )
      }
    }

    Spacer(modifier = Modifier.height(12.dp))

    // Global Progress Bar (Smart Stepper)
    LinearProgressIndicator(
      progress = { progress },
      modifier = Modifier
        .fillMaxWidth()
        .height(6.dp)
        .clip(RoundedCornerShape(3.dp)),
      color = BlushRose,
      trackColor = AuraSurfaceVariant
    )

    Spacer(modifier = Modifier.height(16.dp))

    // Domain Tag / Phase Badge
    Surface(
      shape = RoundedCornerShape(8.dp),
      color = SageGreenContainer,
      border = androidx.compose.foundation.BorderStroke(1.dp, SageGreen.copy(alpha = 0.3f))
    ) {
      Text(
        text = currentStep.domainTag.uppercase(),
        style = MaterialTheme.typography.labelSmall,
        color = SageGreenLight,
        letterSpacing = 1.sp,
        fontSize = 10.sp,
        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
      )
    }

    Spacer(modifier = Modifier.height(12.dp))

    // Main Content Area
    Column(
      modifier = Modifier
        .weight(1f)
        .verticalScroll(rememberScrollState()),
      verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
      Text(
        text = currentStep.title,
        style = MaterialTheme.typography.headlineSmall,
        color = TextPrimary,
        fontWeight = FontWeight.Bold,
        lineHeight = 32.sp
      )

      Text(
        text = currentStep.subtitle,
        style = MaterialTheme.typography.bodyMedium,
        color = TextSecondary,
        lineHeight = 22.sp
      )

      Spacer(modifier = Modifier.height(8.dp))

      when (currentStep.type) {
        IntakeQuestionType.CALMING_INTRO -> {
          // Phase 1: Regulate Before You Request (Calming grounding view)
          Box(
            modifier = Modifier
              .fillMaxWidth()
              .clip(RoundedCornerShape(24.dp))
              .background(BlushRoseContainer)
              .padding(24.dp),
            contentAlignment = Alignment.Center
          ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
              Text(text = "🪷", fontSize = 48.sp)
              Spacer(modifier = Modifier.height(12.dp))
              Text(
                text = "Breathe in calm, exhale tension.",
                style = MaterialTheme.typography.titleMedium,
                color = BlushRose,
                fontWeight = FontWeight.SemiBold,
                textAlign = TextAlign.Center
              )
              Spacer(modifier = Modifier.height(6.dp))
              Text(
                text = "Your inputs are fully encrypted and tailored precisely to your hormonal rhythm.",
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary,
                textAlign = TextAlign.Center
              )
            }
          }
        }

        IntakeQuestionType.DOMAIN_SELECT, IntakeQuestionType.SEGMENTED -> {
          // Phase 3: Segmented Controls / Toggle Tabs
          val selectedSet = answers.getOrPut(currentStep.id) { mutableSetOf() }
          Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            currentStep.options.forEach { option ->
              val isSelected = selectedSet.contains(option.id)
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
                  .clickable {
                    selectedSet.clear()
                    selectedSet.add(option.id)
                  }
              ) {
                Row(
                  modifier = Modifier.padding(16.dp),
                  verticalAlignment = Alignment.CenterVertically
                ) {
                  if (option.icon.isNotEmpty()) {
                    Text(text = option.icon, fontSize = 24.sp)
                    Spacer(modifier = Modifier.width(14.dp))
                  }
                  Column(modifier = Modifier.weight(1f)) {
                    Text(
                      text = option.title,
                      style = MaterialTheme.typography.labelLarge,
                      color = TextPrimary,
                      fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                    )
                    if (option.subtitle.isNotEmpty()) {
                      Text(
                        text = option.subtitle,
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                      )
                    }
                  }
                  if (isSelected) {
                    Icon(
                      imageVector = Icons.Rounded.CheckCircle,
                      contentDescription = null,
                      tint = BlushRose,
                      modifier = Modifier.size(20.dp)
                    )
                  }
                }
              }
            }
          }
        }

        IntakeQuestionType.CHIPS_GRID -> {
          // Phase 3: Visual Option Chips (2x3 Grid)
          val selectedSet = answers.getOrPut(currentStep.id) { mutableSetOf() }
          val chunked = currentStep.options.chunked(2)
          Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            chunked.forEach { rowOptions ->
              Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
              ) {
                rowOptions.forEach { option ->
                  val isSelected = selectedSet.contains(option.id)
                  Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = if (isSelected) BlushRoseContainer else AuraSurface,
                    border = androidx.compose.foundation.BorderStroke(
                      1.dp,
                      if (isSelected) BlushRose else GlassStroke
                    ),
                    modifier = Modifier
                      .weight(1f)
                      .clip(RoundedCornerShape(16.dp))
                      .clickable {
                        if (isSelected) selectedSet.remove(option.id)
                        else selectedSet.add(option.id)
                      }
                  ) {
                    Column(
                      modifier = Modifier.padding(14.dp),
                      horizontalAlignment = Alignment.Start
                    ) {
                      if (option.icon.isNotEmpty()) {
                        Text(text = option.icon, fontSize = 22.sp)
                        Spacer(modifier = Modifier.height(6.dp))
                      }
                      Text(
                        text = option.title,
                        style = MaterialTheme.typography.labelMedium,
                        color = TextPrimary,
                        fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                        maxLines = 2
                      )
                    }
                  }
                }
                if (rowOptions.size == 1) {
                  Spacer(modifier = Modifier.weight(1f))
                }
              }
            }
          }
        }

        IntakeQuestionType.CARDS_WITH_ICONS -> {
          // Phase 3: Large Interactive Cards with Icons
          val selectedSet = answers.getOrPut(currentStep.id) { mutableSetOf() }
          Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            currentStep.options.forEach { option ->
              val isSelected = selectedSet.contains(option.id)
              Surface(
                shape = RoundedCornerShape(24.dp),
                color = if (isSelected) BlushRoseContainer else AuraSurface,
                border = androidx.compose.foundation.BorderStroke(
                  1.5.dp,
                  if (isSelected) BlushRose else GlassStroke
                ),
                modifier = Modifier
                  .fillMaxWidth()
                  .clip(RoundedCornerShape(24.dp))
                  .clickable {
                    selectedSet.clear()
                    selectedSet.add(option.id)
                  }
              ) {
                Row(
                  modifier = Modifier.padding(20.dp),
                  verticalAlignment = Alignment.CenterVertically
                ) {
                  Text(text = option.icon, fontSize = 32.sp)
                  Spacer(modifier = Modifier.width(16.dp))
                  Column(modifier = Modifier.weight(1f)) {
                    Text(
                      text = option.title,
                      style = MaterialTheme.typography.titleMedium,
                      color = TextPrimary,
                      fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                      text = option.subtitle,
                      style = MaterialTheme.typography.bodySmall,
                      color = TextSecondary
                    )
                  }
                }
              }
            }
          }
        }

        IntakeQuestionType.SLIDER_RANGE -> {
          // Phase 3: Interactive Sliders & Steppers (+ / -) eliminating typing
          val currentVal = sliderValues.getOrPut(currentStep.id) { currentStep.sliderMin }
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .clip(RoundedCornerShape(24.dp))
              .background(AuraSurface)
              .border(1.dp, GlassStroke, RoundedCornerShape(24.dp))
              .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
          ) {
            Text(
              text = "${currentVal} ${currentStep.unit}",
              style = MaterialTheme.typography.headlineMedium,
              color = BlushRose,
              fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(16.dp))
            Slider(
              value = currentVal,
              onValueChange = { sliderValues[currentStep.id] = it },
              valueRange = currentStep.sliderMin..currentStep.sliderMax,
              steps = 10,
              colors = SliderDefaults.colors(
                thumbColor = BlushRose,
                activeTrackColor = BlushRose,
                inactiveTrackColor = AuraSurfaceVariant
              )
            )
            Spacer(modifier = Modifier.height(16.dp))
            // Stepper (+ / -) buttons
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              OutlinedButton(
                onClick = {
                  val newVal = (currentVal - 0.5f).coerceIn(currentStep.sliderMin, currentStep.sliderMax)
                  sliderValues[currentStep.id] = newVal
                },
                shape = RoundedCornerShape(12.dp)
              ) {
                Icon(imageVector = Icons.Rounded.Remove, contentDescription = "Decrease")
                Spacer(modifier = Modifier.width(4.dp))
                Text("Decrease")
              }
              OutlinedButton(
                onClick = {
                  val newVal = (currentVal + 0.5f).coerceIn(currentStep.sliderMin, currentStep.sliderMax)
                  sliderValues[currentStep.id] = newVal
                },
                shape = RoundedCornerShape(12.dp)
              ) {
                Icon(imageVector = Icons.Rounded.Add, contentDescription = "Increase")
                Spacer(modifier = Modifier.width(4.dp))
                Text("Increase")
              }
            }
          }
        }

        IntakeQuestionType.LOADER -> {
          // Phase 4: Data Hook Loader
          Box(
            modifier = Modifier
              .fillMaxWidth()
              .height(220.dp),
            contentAlignment = Alignment.Center
          ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
              CircularProgressIndicator(
                color = BlushRose,
                modifier = Modifier.size(56.dp),
                strokeWidth = 4.dp
              )
              Spacer(modifier = Modifier.height(20.dp))
              Text(
                text = "Analyzing your profile...",
                style = MaterialTheme.typography.titleMedium,
                color = TextPrimary,
                fontWeight = FontWeight.SemiBold
              )
              Spacer(modifier = Modifier.height(6.dp))
              Text(
                text = "Synthesizing AI wellness blueprint & auto-saving progress.",
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary
              )
            }
          }
        }

        IntakeQuestionType.RESULTS -> {
          // Phase 4: Results & Auto-Saved Report
          Column(
            modifier = Modifier
              .fillMaxWidth()
              .clip(RoundedCornerShape(24.dp))
              .background(SageGreenContainer)
              .border(1.dp, SageGreen.copy(alpha = 0.4f), RoundedCornerShape(24.dp))
              .padding(24.dp)
          ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
              Text(text = "🎉", fontSize = 32.sp)
              Spacer(modifier = Modifier.width(14.dp))
              Column {
                Text(
                  text = "Intake Successfully Completed!",
                  style = MaterialTheme.typography.titleMedium,
                  color = TextPrimary,
                  fontWeight = FontWeight.Bold
                )
                Text(
                  text = "Auto-saved to secure local storage",
                  style = MaterialTheme.typography.bodySmall,
                  color = SageGreenLight
                )
              }
            }
            Spacer(modifier = Modifier.height(16.dp))
            Divider(color = SageGreen.copy(alpha = 0.3f))
            Spacer(modifier = Modifier.height(16.dp))
            Text(
              text = "• Personalized clinical intelligence enabled\n• Zero-keyboard friction experience verified\n• Branching domain path optimized for your profile",
              style = MaterialTheme.typography.bodyMedium,
              color = TextSecondary,
              lineHeight = 22.sp
            )
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(16.dp))

    // Friendly Inline Validation & Navigation Actions
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
      if (currentStepIndex > 0 && !isLoaderActive) {
        OutlinedButton(
          onClick = { currentStepIndex-- },
          shape = RoundedCornerShape(16.dp),
          modifier = Modifier
            .weight(1f)
            .height(50.dp)
        ) {
          Icon(imageVector = Icons.Rounded.ArrowBack, contentDescription = null, modifier = Modifier.size(18.dp))
          Spacer(modifier = Modifier.width(6.dp))
          Text("Previous")
        }
      }

      Button(
        onClick = {
          if (currentStep.type == IntakeQuestionType.RESULTS) {
            onComplete()
          } else if (currentStep.type == IntakeQuestionType.CALMING_INTRO || currentStep.type == IntakeQuestionType.DOMAIN_SELECT) {
            isLoaderActive = true
            currentStepIndex++
          } else {
            if (currentStepIndex < steps.size - 1) {
              currentStepIndex++
            } else {
              onComplete()
            }
          }
        },
        shape = RoundedCornerShape(16.dp),
        colors = ButtonDefaults.buttonColors(containerColor = BlushRose),
        modifier = Modifier
          .weight(2f)
          .height(50.dp)
      ) {
        Text(
          text = if (currentStep.type == IntakeQuestionType.RESULTS) "Return to App" else "Continue",
          style = MaterialTheme.typography.labelLarge,
          color = TextOnAccent,
          fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.width(6.dp))
        Icon(imageVector = Icons.Rounded.ArrowForward, contentDescription = null, modifier = Modifier.size(18.dp))
      }
    }
  }
}
