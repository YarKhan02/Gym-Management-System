export interface MemberSubscription {
  id: string;
  member_id: string;
  membership_id: string;
  membership_name?: string | null;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
}
