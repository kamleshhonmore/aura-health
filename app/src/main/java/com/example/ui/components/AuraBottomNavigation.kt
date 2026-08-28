package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

data class NavigationItem(
  val label: String,
  val icon: ImageVector,
  val selectedIcon: ImageVector
)

@Composable
fun AuraBottomNavigation(
  currentScreenIndex: Int,
  onScreenSelected: (Int) -> Unit,
  modifier: Modifier = Modifier
) {
  val items = listOf(
    NavigationItem("Home", Icons.Rounded.Home, Icons.Rounded.Home),
    NavigationItem("PCOS Risk", Icons.Rounded.HealthAndSafety, Icons.Rounded.HealthAndSafety),
    NavigationItem("AI Vision", Icons.Rounded.CenterFocusWeak, Icons.Rounded.CenterFocusStrong),
    NavigationItem("Insights", Icons.Rounded.Insights, Icons.Rounded.AutoGraph)
  )

  NavigationBar(
    modifier = modifier
      .fillMaxWidth()
      .border(androidx.compose.foundation.BorderStroke(1.dp, GlassStroke)),
    containerColor = AuraSurfaceVariant.copy(alpha = 0.95f),
    contentColor = TextPrimary,
    tonalElevation = 8.dp
  ) {
    items.forEachIndexed { index, item ->
      val isSelected = currentScreenIndex == index
      
      NavigationBarItem(
        selected = isSelected,
        onClick = { onScreenSelected(index) },
        icon = {
          Icon(
            imageVector = if (isSelected) item.selectedIcon else item.icon,
            contentDescription = item.label,
            modifier = Modifier.size(24.dp)
          )
        },
        label = {
          Text(
            text = item.label,
            style = MaterialTheme.typography.labelSmall,
            fontSize = 11.sp,
            color = if (isSelected) BlushRose else TextSecondary
          )
        },
        colors = NavigationBarItemDefaults.colors(
          selectedIconColor = BlushRose,
          selectedTextColor = BlushRose,
          indicatorColor = BlushRoseContainer,
          unselectedIconColor = TextMuted,
          unselectedTextColor = TextMuted
        )
      )
    }
  }
}
