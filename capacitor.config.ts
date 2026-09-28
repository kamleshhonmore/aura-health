import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aura.health',
  appName: 'Aura Health',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
