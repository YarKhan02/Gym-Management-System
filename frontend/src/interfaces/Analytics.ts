export interface AnalyticsOverview {
  total_members: number;
  active_members: number;
  inactive_members: number;
  active_subscriptions: number;
  expiring_this_week: number;
  expiring_this_month: number;
  total_revenue_all_time: number;
  revenue_this_month: number;
  revenue_last_month: number;
  revenue_growth_percent: number;
  new_members_this_month: number;
  new_members_last_month: number;
}

export interface MemberGrowthPoint {
  month: string;
  label: string;
  new_members: number;
  cumulative: number;
}

export interface DemographicsResponse {
  gender: { label: string; count: number }[];
  status: { label: string; count: number }[];
}

export interface RevenuePoint {
  month: string;
  label: string;
  revenue: number;
}

export interface PaymentMethodStat {
  method: string;
  count: number;
  total: number;
}

export interface SubscriptionStatusStat {
  status: string;
  count: number;
}

export interface PlanStat {
  plan_id: number;
  plan_name: string;
  price: number;
  duration_days: number;
  subscriber_count: number;
  active_count: number;
  total_revenue: number;
  avg_renewals: number;
}

export interface ExpiringSubscription {
  member_id: number;
  member_name: string;
  phone_number: string;
  plan_name: string;
  end_date: string;
  days_remaining: number;
}

export interface TopMember {
  member_id: number;
  member_name: string;
  subscription_count: number;
  total_paid: number;
  join_date: string;
  is_active: boolean;
}