import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uk.cybertecpro.prometheusot.mobile',
  appName: 'Prometheus-OT Mobile',
  webDir: 'dist',
  backgroundColor: '#080d17',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    Network: {}
  }
};

export default config;
