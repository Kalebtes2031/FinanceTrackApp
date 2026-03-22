import api from './client';
import { Category, PaginatedResponse } from './types';

export async function fetchCategories() {
  const response = await api.get<PaginatedResponse<Category>>('/categories/');
  return response.data.results;
}

export async function createCategory(payload: { name: string; type: Category['type'] }) {
  const response = await api.post<Category>('/categories/', payload);
  return response.data;
}

export async function updateCategory(id: number, payload: Partial<{ name: string; type: Category['type'] }>) {
  const response = await api.patch<Category>(`/categories/${id}/`, payload);
  return response.data;
}

export async function deleteCategory(id: number) {
  await api.delete(`/categories/${id}/`);
}
