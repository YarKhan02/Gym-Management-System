import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '@/api/analytics';

const analyticsQueryOptions = {
  staleTime: Infinity,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
} as const;

export const useAnalyticsOverview = () =>
  useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: analyticsAPI.overview,
    ...analyticsQueryOptions,
  });

export const useMemberGrowth = () =>
  useQuery({
    queryKey: ['analytics', 'memberGrowth'],
    queryFn: () => analyticsAPI.memberGrowth(12),
    ...analyticsQueryOptions,
  });

export const useMemberDemographics = () =>
  useQuery({
    queryKey: ['analytics', 'demographics'],
    queryFn: analyticsAPI.demographics,
    ...analyticsQueryOptions,
  });

export const useRevenueTimeline = () =>
  useQuery({
    queryKey: ['analytics', 'revenueTimeline'],
    queryFn: () => analyticsAPI.revenueTimeline(12),
    ...analyticsQueryOptions,
  });

export const usePaymentMethods = () =>
  useQuery({
    queryKey: ['analytics', 'paymentMethods'],
    queryFn: analyticsAPI.paymentMethods,
    ...analyticsQueryOptions,
  });

export const useSubscriptionStatus = () =>
  useQuery({
    queryKey: ['analytics', 'subStatus'],
    queryFn: analyticsAPI.subscriptionStatus,
    ...analyticsQueryOptions,
  });

export const usePlansAnalytics = () =>
  useQuery({
    queryKey: ['analytics', 'plans'],
    queryFn: analyticsAPI.plans,
    ...analyticsQueryOptions,
  });

export const useExpiringSubscriptions = () =>
  useQuery({
    queryKey: ['analytics', 'expiring'],
    queryFn: () => analyticsAPI.expiring(30),
    ...analyticsQueryOptions,
  });

export const useTopMembers = () =>
  useQuery({
    queryKey: ['analytics', 'topMembers'],
    queryFn: () => analyticsAPI.topMembers(10),
    ...analyticsQueryOptions,
  });
