import { useQuery } from '@tanstack/react-query';
import * as dashboardAPI from '@/api/dashboard';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardAPI.getDashboardData,
  });
};
