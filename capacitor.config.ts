
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7e7701cdb14b43bf947dac26feb89df2',
  appName: 'Quantum AI Consciousness',
  webDir: 'dist',
  server: {
    url: 'https://7e7701cd-b14b-43bf-947d-ac26feb89df2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'microphone', 'photos']
    },
    SpeechRecognition: {
      permissions: ['microphone']
    }
  }
};

export default config;
