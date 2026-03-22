import { Platform } from 'react-native';

export const theme = {
  colors: {
    background: '#F6F4F0',
    surface: '#FFFFFF',
    text: '#1F1A17',
    muted: '#6C6A67',
    primary: '#2F6F5E',
    primaryDark: '#244C44',
    accent: '#E3B261',
    danger: '#B5482B',
    border: '#E7E0D6',
    card: '#FFFFFF',
    success: '#2E7D32',
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 24,
  },
  shadow: {
    card: {
      shadowColor: '#000000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
  },
  fonts: {
    heading: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-condensed', default: 'System' }),
    body: Platform.select({ ios: 'Avenir', android: 'sans-serif', default: 'System' }),
  },
};