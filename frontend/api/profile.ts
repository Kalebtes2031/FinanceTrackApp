import api from './client';

export interface Profile {
  id: number;
  username: string;
  email: string;
}

export async function fetchProfile() {
  const response = await api.get<Profile>('/auth/users/me/');
  return response.data;
}
