package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.Spa
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationSheet(
  notifications: List<Pair<String, String>>,
  onDismiss: () -> Unit
) {
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
    ) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column {
          Text(
            text = "Health Insights & Reminders",
            style = MaterialTheme.typography.titleLarge,
            color = TextPrimary,
            fontWeight = FontWeight.SemiBold
          )
          Text(
            text = "Personalized for Follicular Phase",
            style = MaterialTheme.typography.labelSmall,
            color = TextSecondary
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

      Spacer(modifier = Modifier.height(16.dp))

      LazyColumn(
        verticalArrangement = Arrangement.spacedBy(10.dp)
      ) {
        items(notifications) { item ->
          Surface(
            shape = RoundedCornerShape(20.dp),
            color = AuraSurfaceVariant,
            border = androidx.compose.foundation.BorderStroke(1.dp, GlassStroke),
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(
              modifier = Modifier.padding(16.dp),
              verticalAlignment = Alignment.Top
            ) {
              Box(
                modifier = Modifier
                  .size(36.dp)
                  .clip(CircleShape)
                  .background(SageGreenContainer),
                contentAlignment = Alignment.Center
              ) {
                Icon(
                  imageVector = Icons.Rounded.Spa,
                  contentDescription = null,
                  tint = SageGreenLight,
                  modifier = Modifier.size(18.dp)
                )
              }
              Spacer(modifier = Modifier.width(12.dp))
              Column(modifier = Modifier.weight(1f)) {
                Text(
                  text = item.first,
                  style = MaterialTheme.typography.titleSmall,
                  color = TextPrimary,
                  fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                  text = item.second,
                  style = MaterialTheme.typography.bodySmall,
                  color = TextSecondary,
                  lineHeight = 18.sp
                )
              }
            }
          }
        }
      }
    }
  }
}
