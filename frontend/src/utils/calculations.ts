import { Payment } from '@/interfaces/Payment';
import { Member } from '@/interfaces/Member';
import { MemberSubscription } from '@/interfaces/MemberSubscription';
import { getMonthStart, getMonthEnd, isExpired } from './dateHelpers';

export const calculateTotalRevenue = (payments: Payment[], startDate?: string, endDate?: string): number => {
  const start = startDate || getMonthStart();
  const end = endDate || getMonthEnd();
  
  return payments
    .filter(p => p.payment_date >= start && p.payment_date <= end)
    .reduce((sum, p) => sum + p.amount, 0);
};

export const getActiveMembers = (members: Member[], subscriptions: MemberSubscription[]): Member[] => {
  const activeMemberIds = subscriptions
    .filter(s => s.status === 'active' && !isExpired(s.end_date))
    .map(s => s.member_id);
  
  return members.filter(m => m.is_active && activeMemberIds.includes(m.id));
};

export const getExpiredMembers = (members: Member[], subscriptions: MemberSubscription[]): Member[] => {
  const expiredMemberIds = subscriptions
    .filter(s => s.status === 'active' && isExpired(s.end_date))
    .map(s => s.member_id);
  
  return members.filter(m => expiredMemberIds.includes(m.id));
};
