package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Done
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.*
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LogSymptomsSheet(
  initialLog: DailyLog,
  onDismiss: () -> Unit,
  onSave: (
    flow: FlowLevel,
    cramps: Int,
    energy: Int,
    mood: MoodType,
    skin: SkinCondition,
    sleep: Float,
    bbt: Float,
    mucus: String,
    notes: String
  ) -> Unit
) {
  var selectedFlow by remember { mutableStateOf(initialLog.flow) }
  var crampsValue by remember { mutableStateOf(initialLog.crampsLevel.toFloat()) }
  var energyValue by remember { mutableStateOf(initialLog.energyLevel.toFloat()) }
  var selectedMood by remember { mutableStateOf(initialLog.mood) }
  var selectedSkin by remember { mutableStateOf(initialLog.skinCondition) }
  var sleepHours by remember { mutableStateOf(initialLog.sleepHours) }
  var bbtValue by remember { mutableStateOf(initialLog.basalTemp) }
  var notesText by remember { mutableStateOf(initialLog.notes) }

  ModalBottomSheet(
    onDismissRequest = onDismiss,
    containerColor = AuraSurface,
    tonalElevation = 16.dp,
    shape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp),
    dragHandle = {
      Box(
        modifier = Modifier
          .padding(vertical = 12.dp)
          .width(40.dp)
          .height(4.dp)
          .clip(CircleShape)
          .background(TextMuted.copy(alpha = 0.5f))
      )
    }
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp)
        .padding(bottom = 32.dp)
        .verticalScroll(rememberScrollState())
    ) {
      // Sheet Header
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column {
          Text(
            text = "Daily Symptom Log",
            style = MaterialTheme.typography.titleLarge,
            color = TextPrimary,
            fontWeight = FontWeight.SemiBold
          )
          Text(
            text = "Cycle Day 8 • Follicular Phase",
            style = MaterialTheme.typography.labelSmall,
            color = SageGreenLight
          )
        }

        IconButton(
          onClick = onDismiss,
          modifier = Modifier
            .size(36.dp)
            .background(AuraSurfaceVariant, CircleShape)
        ) {
          Icon(
            imageVector = Icons.Rounded.Close,
            contentDescription = "Close",
            tint = TextSecondary,
            modifier = Modifier.size(18.dp)
          )
        }
      }

      Spacer(modifier = Modifier.height(20.dp))

      // 1. Menstrual Flow Level
      Text(
        text = "Menstrual Flow Intensity",
        style = MaterialTheme.typography.labelMedium,
        color = TextSecondary,
        fontWeight = FontWeight.SemiBold
      )
      Spacer(modifier = Modifier.height(8.dp))
      LazyRow(
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        items(FlowLevel.values().toList()) { flow ->
          val isSelected = selectedFlow == flow
          Surface(
            shape = RoundedCornerShape(14.dp),
            color = if (isSelected) BlushRoseContainer else AuraSurfaceVariant,
            border = androidx.compose.foundation.BorderStroke(
              1.dp,
              if (isSelected) BlushRose else GlassStroke
            ),
            modifier = Modifier
              .clip(RoundedCornerShape(14.dp))
              .clickable { selectedFlow = flow }
          ) {
            Text(
              text = flow.label,
              style = MaterialTheme.typography.labelSmall,
              color = if (isSelected) BlushRoseLight else TextSecondary,
              fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
              modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
            )
          }
        }
      }

      Spacer(modifier = Modifier.height(18.dp))

      // 2. Cramps & Pelvic Pain Slider (0 - 10)
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
      ) {
        Text(
          text = "Pelvic / Cramps Severity",
          style = MaterialTheme.typography.labelMedium,
          color = TextSecondary,
          fontWeight = FontWeight.SemiBold
        )
        Text(
          text = "${crampsValue.toInt()} / 10",
          style = MaterialTheme.typography.labelMedium,
          color = BlushRose,
          fontWeight = FontWeight.Bold
        )
      }
      Slider(
        value = crampsValue,
        onValueChange = { crampsValue = it },
        valueRange = 0f..10f,
        steps = 9,
        colors = SliderDefaults.colors(
          thumbColor = BlushRose,
          activeTrackColor = BlushRose,
          inactiveTrackColor = AuraSurfaceVariant
        )
      )

      Spacer(modifier = Modifier.height(12.dp))

      // 3. Energy & Vitality (1 - 10)
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
      ) {
        Text(
          text = "Energy & Vitality",
          style = MaterialTheme.typography.labelMedium,
          color = TextSecondary,
          fontWeight = FontWeight.SemiBold
        )
        Text(
          text = "${energyValue.toInt()} / 10",
          style = MaterialTheme.typography.labelMedium,
          color = ChampagneGold,
          fontWeight = FontWeight.Bold
        )
      }
      Slider(
        value = energyValue,
        onValueChange = { energyValue = it },
        valueRange = 1f..10f,
        steps = 8,
        colors = SliderDefaults.colors(
          thumbColor = ChampagneGold,
          activeTrackColor = ChampagneGold,
          inactiveTrackColor = AuraSurfaceVariant
        )
      )

      Spacer(modifier = Modifier.height(18.dp))

      // 4. Mood
      Text(
        text = "Dominant Emotional State",
        style = MaterialTheme.typography.labelMedium,
        color = TextSecondary,
        fontWeight = FontWeight.SemiBold
      )
      Spacer(modifier = Modifier.height(8.dp))
      LazyRow(
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        items(MoodType.values().toList()) { mood ->
          val isSelected = selectedMood == mood
          Surface(
            shape = RoundedCornerShape(14.dp),
            color = if (isSelected) SageGreenContainer else AuraSurfaceVariant,
            border = androidx.compose.foundation.BorderStroke(
              1.dp,
              if (isSelected) SageGreen else GlassStroke
            ),
            modifier = Modifier
              .clip(RoundedCornerShape(14.dp))
              .clickable { selectedMood = mood }
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
              verticalAlignment = Alignment.CenterVertically
            ) {
              Text(text = mood.emoji, fontSize = 14.sp)
              Spacer(modifier = Modifier.width(6.dp))
              Text(
                text = mood.label,
                style = MaterialTheme.typography.labelSmall,
                color = if (isSelected) SageGreenLight else TextSecondary,
                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
              )
            }
          }
        }
      }

      Spacer(modifier = Modifier.height(18.dp))

      // 5. Skin Status
      Text(
        text = "Dermal & Acne Status",
        style = MaterialTheme.typography.labelMedium,
        color = TextSecondary,
        fontWeight = FontWeight.SemiBold
      )
      Spacer(modifier = Modifier.height(8.dp))
      Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        SkinCondition.values().forEach { skin ->
          val isSelected = selectedSkin == skin
          Surface(
            shape = RoundedCornerShape(14.dp),
            color = if (isSelected) AuraSurfaceElevated else AuraSurfaceVariant,
            border = androidx.compose.foundation.BorderStroke(
              1.dp,
              if (isSelected) BlushRose.copy(alpha = 0.6f) else GlassStroke
            ),
            modifier = Modifier
              .fillMaxWidth()
              .clip(RoundedCornerShape(14.dp))
              .clickable { selectedSkin = skin }
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
              verticalAlignment = Alignment.CenterVertically,
              horizontalArrangement = Arrangement.SpaceBetween
            ) {
              Column {
                Text(
                  text = skin.label,
                  style = MaterialTheme.typography.labelMedium,
                  color = if (isSelected) TextPrimary else TextSecondary,
                  fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                )
                Text(
                  text = skin.description,
                  style = MaterialTheme.typography.bodySmall,
                  color = TextMuted,
                  fontSize = 11.sp
                )
              }
              if (isSelected) {
                Icon(
                  imageVector = Icons.Rounded.Done,
                  contentDescription = null,
                  tint = BlushRose,
                  modifier = Modifier.size(18.dp)
                )
              }
            }
          }
        }
      }

      Spacer(modifier = Modifier.height(18.dp))

      // 6. Notes Input
      Text(
        text = "Personal Notes",
        style = MaterialTheme.typography.labelMedium,
        color = TextSecondary,
        fontWeight = FontWeight.SemiBold
      )
      Spacer(modifier = Modifier.height(8.dp))
      OutlinedTextField(
        value = notesText,
        onValueChange = { notesText = it },
        placeholder = { Text("Log any cravings, ovulation pains, or workout notes...", color = TextMuted) },
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = OutlinedTextFieldDefaults.colors(
          focusedContainerColor = AuraSurfaceVariant,
          unfocusedContainerColor = AuraSurfaceVariant,
          focusedBorderColor = BlushRose,
          unfocusedBorderColor = GlassStroke,
          focusedTextColor = TextPrimary,
          unfocusedTextColor = TextPrimary
        ),
        maxLines = 3
      )

      Spacer(modifier = Modifier.height(24.dp))

      // Save Button
      Button(
        onClick = {
          onSave(
            selectedFlow,
            crampsValue.toInt(),
            energyValue.toInt(),
            selectedMood,
            selectedSkin,
            sleepHours,
            bbtValue,
            "Creamy / Hydrated",
            notesText
          )
        },
        modifier = Modifier
          .fillMaxWidth()
          .height(50.dp),
        shape = RoundedCornerShape(18.dp),
        colors = ButtonDefaults.buttonColors(
          containerColor = BlushRose,
          contentColor = TextOnAccent
        )
      ) {
        Icon(
          imageVector = Icons.Rounded.Done,
          contentDescription = null,
          modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
          text = "Save Daily Log",
          style = MaterialTheme.typography.labelLarge,
          fontWeight = FontWeight.SemiBold
        )
      }
    }
  }
}
