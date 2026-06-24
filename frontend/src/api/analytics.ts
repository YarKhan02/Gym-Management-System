import { apiClient } from './client';

import { AnalyticsOverview, MemberGrowthPoint, DemographicsResponse, RevenuePoint, PaymentMethodStat, SubscriptionStatusStat, PlanStat, ExpiringSubscription, TopMember} from '@/interfaces/Analytics';

const get = async <T>(url: string): Promise<T> => (await apiClient.get(url)).data;

export const analyticsAPI = {
  overview: () => get<AnalyticsOverview>('/api/analytics/overview'),
  memberGrowth: (months = 12) =>
    get<{ data: MemberGrowthPoint[] }>(`/api/analytics/members/growth?months=${months}`),
  demographics: () => get<DemographicsResponse>('/api/analytics/members/demographics'),
  revenueTimeline: (months = 12) =>
    get<{ data: RevenuePoint[] }>(`/api/analytics/revenue/timeline?months=${months}`),
  paymentMethods: () => get<{ data: PaymentMethodStat[] }>('/api/analytics/revenue/payment-methods'),
  subscriptionStatus: () =>
    get<{ data: SubscriptionStatusStat[] }>('/api/analytics/subscriptions/status'),
  plans: () => get<{ data: PlanStat[] }>('/api/analytics/subscriptions/plans'),
  expiring: (days = 30) =>
    get<{ data: ExpiringSubscription[] }>(`/api/analytics/subscriptions/expiring?days=${days}`),
  topMembers: (limit = 10) =>
    get<{ data: TopMember[] }>(`/api/analytics/members/top-revenue?limit=${limit}`),
};