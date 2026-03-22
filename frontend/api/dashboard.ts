import api from './client';
import { DashboardResponse } from './types';

export async function fetchDashboard() {
  const response = await api.get<DashboardResponse>('/dashboard/');
  return response.data;
}