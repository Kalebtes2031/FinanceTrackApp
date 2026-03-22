import api from './client';

export async function login(username: string, password: string) {
  const response = await api.post('/auth/jwt/create/', { username, password });
  return response.data as { access: string; refresh: string };
}

export async function register(payload: { username: string; password: string; re_password: string }) {
  const response = await api.post('/auth/users/', payload);
  return response.data as { id: number; username: string };
}
