import confetti from 'canvas-confetti';

export interface CelebrationOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  zIndex?: number;
}

/**
 * Standardized celebration confetti trigger.
 * Renders in an isolated non-interactive overlay (z-index: 600)
 * with an auto-dismiss timer (2.5s) that resets/cleans up canvas nodes.
 */
export function fireCelebrationConfetti(options?: CelebrationOptions) {
  try {
    const instance = confetti({
      zIndex: 600,
      particleCount: options?.particleCount ?? 50,
      spread: options?.spread ?? 60,
      origin: options?.origin ?? { y: 0.6 },
      colors: options?.colors ?? ['#C86D51', '#5B8A72', '#7B6B8D', '#E8ACA0'],
      disableForReducedMotion: true,
      ...options,
    });

    // Auto-dismiss cleanup after 2.5 seconds (2500ms)
    setTimeout(() => {
      try {
        confetti.reset();
      } catch (e) {
        // Ignore reset errors if canvas was already removed
      }
    }, 2500);

    return instance;
  } catch (e) {
    console.warn('Failed to fire celebration confetti:', e);
  }
}
