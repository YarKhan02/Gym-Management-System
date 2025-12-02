import { apiClient } from './client';

import { DashboardData } from '@/interfaces/Dashboard';

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await apiClient.get('/api/dashboard');
  return response.data;
};
