import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.speedreading.app',
  appName: 'Speed Reading',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
