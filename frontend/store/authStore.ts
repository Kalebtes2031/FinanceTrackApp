import { create } from 'zustand';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@/api/tokenStorage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  setAuth: (accessToken: string, refreshToken: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  hydrated: false,
  setAuth: async (accessToken, refreshToken) => {
    await setTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken });
  },
  clearAuth: async () => {
    await clearTokens();
    set({ accessToken: null, refreshToken: null });
  },
  hydrate: async () => {
    const [accessToken, refreshToken] = await Promise.all([
      getAccessToken(),
      getRefreshToken(),
    ]);
    set({ accessToken: accessToken ?? null, refreshToken: refreshToken ?? null, hydrated: true });
  },
}));