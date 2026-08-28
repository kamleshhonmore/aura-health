package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val AuraDarkColorScheme = darkColorScheme(
  primary = BlushRose,
  onPrimary = TextOnAccent,
  primaryContainer = BlushRoseContainer,
  onPrimaryContainer = BlushRoseLight,
  
  secondary = SageGreen,
  onSecondary = TextOnAccent,
  secondaryContainer = SageGreenContainer,
  onSecondaryContainer = SageGreenLight,
  
  tertiary = ChampagneGold,
  onTertiary = TextOnAccent,
  tertiaryContainer = ChampagneGoldContainer,
  onTertiaryContainer = ChampagneGoldLight,
  
  background = AuraBackground,
  onBackground = TextPrimary,
  
  surface = AuraSurface,
  onSurface = TextPrimary,
  surfaceVariant = AuraSurfaceVariant,
  onSurfaceVariant = TextSecondary,
  
  outline = GlassStroke,
  outlineVariant = TextMuted,
  
  error = RiskElevated,
  onError = Color.White
)

@Composable
fun AuraHealthTheme(
  content: @Composable () -> Unit
) {
  MaterialTheme(
    colorScheme = AuraDarkColorScheme,
    typography = Typography,
    content = content
  )
}
