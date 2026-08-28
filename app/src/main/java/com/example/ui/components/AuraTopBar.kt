package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.rounded.CalendarToday
import androidx.compose.material.icons.rounded.Spa
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.CycleInfo
import com.example.ui.theme.*

@Composable
fun AuraTopBar(
  userName: String,
  cycleInfo: CycleInfo,
  unreadCount: Int,
  onNotificationClick: () -> Unit,
  modifier: Modifier = Modifier
) {
  Row(
    modifier = modifier
      .fillMaxWidth()
      .padding(horizontal = 20.dp, vertical = 14.dp),
    horizontalArrangement = Arrangement.SpaceBetween,
    verticalAlignment = Alignment.CenterVertically
  ) {
    Column {
      Row(verticalAlignment = Alignment.CenterVertically) {
        Text(
          text = "Hello, $userName",
          style = MaterialTheme.typography.headlineMedium,
          color = TextPrimary
        )
        Spacer(modifier = Modifier.width(6.dp))
        Icon(
          imageVector = Icons.Rounded.Spa,
          contentDescription = null,
          tint = SageGreen,
          modifier = Modifier.size(20.dp)
        )
      }
      
      Spacer(modifier = Modifier.height(4.dp))
      
      // Cycle Phase Badge
      Surface(
        shape = RoundedCornerShape(12.dp),
        color = SageGreenContainer,
        border = androidx.compose.foundation.BorderStroke(1.dp, SageGreen.copy(alpha = 0.35f))
      ) {
        Row(
          modifier = Modifier.padding(horizontal = 10.dp, vertical = 3.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Box(
            modifier = Modifier
              .size(7.dp)
              .clip(CircleShape)
              .background(SageGreen)
          )
          Spacer(modifier = Modifier.width(6.dp))
          Text(
            text = "${cycleInfo.currentPhase.displayName} • Day ${cycleInfo.currentCycleDay}",
            style = MaterialTheme.typography.labelMedium,
            color = SageGreenLight,
            fontSize = 12.sp
          )
        }
      }
    }

    // Notification Bell with Badge
    Box(
      modifier = Modifier
        .size(44.dp)
        .clip(CircleShape)
        .background(AuraSurfaceVariant)
        .border(1.dp, GlassStroke, CircleShape)
        .clickable { onNotificationClick() },
      contentAlignment = Alignment.Center
    ) {
      Icon(
        imageVector = Icons.Outlined.Notifications,
        contentDescription = "Notifications",
        tint = TextPrimary,
        modifier = Modifier.size(22.dp)
      )
      if (unreadCount > 0) {
        Box(
          modifier = Modifier
            .size(10.dp)
            .align(Alignment.TopEnd)
            .offset(x = (-6).dp, y = 6.dp)
            .clip(CircleShape)
            .background(BlushRose)
            .border(1.5.dp, AuraBackground, CircleShape)
        )
      }
    }
  }
}
