export interface DashboardStats {
  total_members: number;
  active_members: number;
  expired_members: number;
  month_revenue: number;
}

export interface ExpiringSubscription {
  subscription_id: string;
  member_id: string;
  member_name: string;
  membership_id: string;
  membership_name: string;
  end_date: string;
  days_until_expiry: number;
}

export interface RecentPayment {
  payment_id: string;
  member_id: string;
  member_name: string;
  amount: number;
  payment_date: string;
  method: string;
}

export interface DashboardData {
  stats: DashboardStats;
  expiring_subscriptions: ExpiringSubscription[];
  recent_payments: RecentPayment[];
}