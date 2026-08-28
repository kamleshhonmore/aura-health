package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.QuickSymptomCategory
import com.example.ui.theme.*

@Composable
fun QuickLogBar(
  activeSymptoms: Set<String>,
  onToggleSymptom: (String) -> Unit,
  onOpenFullLog: () -> Unit,
  modifier: Modifier = Modifier
) {
  val scrollState = rememberScrollState()

  Column(
    modifier = modifier
      .fillMaxWidth()
      .padding(vertical = 8.dp)
  ) {
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(horizontal = 20.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Text(
        text = "Quick Log Today",
        style = MaterialTheme.typography.titleSmall,
        color = TextPrimary,
        fontWeight = FontWeight.SemiBold
      )
      
      Text(
        text = "Customize",
        style = MaterialTheme.typography.labelSmall,
        color = BlushRose,
        modifier = Modifier
          .clickable { onOpenFullLog() }
          .padding(4.dp)
      )
    }

    Spacer(modifier = Modifier.height(10.dp))

    Row(
      modifier = Modifier
        .fillMaxWidth()
        .horizontalScroll(scrollState)
        .padding(horizontal = 20.dp),
      horizontalArrangement = Arrangement.spacedBy(8.dp),
      verticalAlignment = Alignment.CenterVertically
    ) {
      QuickSymptomChip(
        id = "cramps",
        label = "Cramps",
        icon = Icons.Rounded.Healing,
        isSelected = activeSymptoms.contains("cramps"),
        activeColor = BlushRose,
        activeBg = BlushRoseContainer,
        onClick = { onToggleSymptom("cramps") }
      )

      QuickSymptomChip(
        id = "energy",
        label = "High Energy",
        icon = Icons.Rounded.Bolt,
        isSelected = activeSymptoms.contains("energy"),
        activeColor = ChampagneGold,
        activeBg = ChampagneGoldContainer,
        onClick = { onToggleSymptom("energy") }
      )

      QuickSymptomChip(
        id = "skin",
        label = "Skin / Acne",
        icon = Icons.Rounded.Face,
        isSelected = activeSymptoms.contains("skin"),
        activeColor = SageGreen,
        activeBg = SageGreenContainer,
        onClick = { onToggleSymptom("skin") }
      )

      QuickSymptomChip(
        id = "mood",
        label = "Calm Mood",
        icon = Icons.Rounded.Mood,
        isSelected = activeSymptoms.contains("mood"),
        activeColor = IndicatorFollicular,
        activeBg = AuraSurfaceElevated,
        onClick = { onToggleSymptom("mood") }
      )

      QuickSymptomChip(
        id = "flow",
        label = "Flow Status",
        icon = Icons.Rounded.WaterDrop,
        isSelected = activeSymptoms.contains("flow"),
        activeColor = BlushRose,
        activeBg = BlushRoseContainer,
        onClick = { onToggleSymptom("flow") }
      )

      QuickSymptomChip(
        id = "sleep",
        label = "Sleep 8h",
        icon = Icons.Rounded.Bedtime,
        isSelected = activeSymptoms.contains("sleep"),
        activeColor = IndicatorLuteal,
        activeBg = AuraSurfaceElevated,
        onClick = { onToggleSymptom("sleep") }
      )

      // Add full logger button chip
      Surface(
        shape = RoundedCornerShape(16.dp),
        color = AuraSurfaceVariant,
        border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke),
        modifier = Modifier
          .clip(RoundedCornerShape(16.dp))
          .clickable { onOpenFullLog() }
      ) {
        Row(
          modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Icon(
            imageVector = Icons.Rounded.EditNote,
            contentDescription = "Full Log",
            tint = TextSecondary,
            modifier = Modifier.size(16.dp)
          )
          Spacer(modifier = Modifier.width(4.dp))
          Text(
            text = "More...",
            style = MaterialTheme.typography.labelSmall,
            color = TextSecondary
          )
        }
      }
    }
  }
}

@Composable
fun QuickSymptomChip(
  id: String,
  label: String,
  icon: ImageVector,
  isSelected: Boolean,
  activeColor: Color,
  activeBg: Color,
  onClick: () -> Unit
) {
  val bgColor = if (isSelected) activeBg else AuraSurfaceVariant
  val borderColor = if (isSelected) activeColor.copy(alpha = 0.6f) else GlassStroke
  val contentColor = if (isSelected) activeColor else TextSecondary

  Surface(
    shape = RoundedCornerShape(18.dp),
    color = bgColor,
    border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
    modifier = Modifier
      .clip(RoundedCornerShape(18.dp))
      .clickable { onClick() }
  ) {
    Row(
      modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp),
      verticalAlignment = Alignment.CenterVertically
    ) {
      if (isSelected) {
        Box(
          modifier = Modifier
            .size(6.dp)
            .clip(CircleShape)
            .background(activeColor)
        )
        Spacer(modifier = Modifier.width(6.dp))
      }
      Icon(
        imageVector = icon,
        contentDescription = label,
        tint = contentColor,
        modifier = Modifier.size(16.dp)
      )
      Spacer(modifier = Modifier.width(5.dp))
      Text(
        text = label,
        style = MaterialTheme.typography.labelSmall,
        color = if (isSelected) TextPrimary else TextSecondary,
        fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
        fontSize = 12.sp
      )
    }
  }
}
