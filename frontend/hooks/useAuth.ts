import { useMutation } from '@tanstack/react-query';
import { login, register } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const toast = useToast();
  return useMutation({
    mutationFn: async (payload: { username: string; password: string }) => {
      const data = await login(payload.username, payload.password);
      await setAuth(data.access, data.refresh);
      return data;
    },
    onSuccess: () => toast('Welcome back!', 'success'),
    onError: () => toast('Login failed', 'error'),
  });
}

export function useRegister() {
  const toast = useToast();
  return useMutation({
    mutationFn: async (payload: { username: string; password: string; re_password: string }) => {
      return register(payload);
    },
    onSuccess: () => toast('Account created', 'success'),
    onError: () => toast('Registration failed', 'error'),
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  return async () => {
    await clearAuth();
  };
}
