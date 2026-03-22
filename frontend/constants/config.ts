import Constants from 'expo-constants';

const env = Constants.expoConfig?.extra ?? {};

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (env.EXPO_PUBLIC_API_URL as string) ||
  'http://localhost:8000/api';