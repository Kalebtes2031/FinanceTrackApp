import api from './client';
import { PaginatedResponse, Transaction } from './types';

export async function fetchTransactions() {
  const response = await api.get<PaginatedResponse<Transaction>>('/transactions/');
  return response.data.results;
}

export async function createTransaction(payload: {
  account: number;
  to_account?: number | null;
  amount: string;
  type: Transaction['type'];
  category?: number | null;
  description?: string;
}) {
  const response = await api.post<Transaction>('/transactions/', payload);
  return response.data;
}

export async function updateTransaction(
  id: number,
  payload: Partial<{ account: number; to_account: number | null; amount: string; type: Transaction['type']; category: number | null; description: string }>
) {
  const response = await api.patch<Transaction>(`/transactions/${id}/`, payload);
  return response.data;
}

export async function deleteTransaction(id: number) {
  await api.delete(`/transactions/${id}/`);
}
