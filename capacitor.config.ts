import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aura.health',
  appName: 'Aura Health',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 500,
      launchAutoHide: true,
      backgroundColor: '#FAF8F5',
      showSpinner: false,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
