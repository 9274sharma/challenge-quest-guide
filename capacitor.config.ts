import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4364476286284438a75cc57468fe8561',
  appName: 'challenge-quest-guide',
  webDir: 'dist',
  server: {
    url: 'https://43644762-8628-4438-a75c-c57468fe8561.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      showSpinner: false,
      backgroundColor: '#3B82F6'
    }
  }
};

export default config;