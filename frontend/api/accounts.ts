import api from './client';
import { Account, PaginatedResponse } from './types';

export async function fetchAccounts() {
  const response = await api.get<PaginatedResponse<Account>>('/accounts/');
  return response.data.results;
}

export async function createAccount(payload: {
  name: string;
  type: Account['type'];
  currency: string;
  balance: string;
}) {
  const response = await api.post<Account>('/accounts/', payload);
  return response.data;
}

export async function updateAccount(id: number, payload: { name: string; type: Account['type']; currency: string }) {
  const response = await api.patch<Account>(`/accounts/${id}/`, payload);
  return response.data;
}

export async function deleteAccount(id: number) {
  await api.delete(`/accounts/${id}/`);
}
