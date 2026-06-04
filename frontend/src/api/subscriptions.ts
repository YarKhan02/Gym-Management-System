import { MemberSubscription } from '@/interfaces/MemberSubscription';
import { apiClient } from './client';

export const getSubscriptions = async (): Promise<MemberSubscription[]> => {
  const response = await apiClient.get('/api/subscriptions');
  return response.data;
};

export const getSubscriptionsByMemberId = async (memberId: string): Promise<MemberSubscription[]> => {
  const response = await apiClient.get(`/api/subscriptions/member/${memberId}`);
  return response.data;
};

export const getUnpaidSubscriptionsByMemberId = async (memberId: string): Promise<MemberSubscription[]> => {
  const response = await apiClient.get(`/api/subscriptions/member/${memberId}?unpaid=true`);
  return response.data;
};

export const createSubscription = async (data: Omit<MemberSubscription, 'id'>): Promise<MemberSubscription> => {
  const response = await apiClient.post('/api/subscriptions', data);
  return response.data;
};

export const updateSubscription = async (id: string, data: Partial<MemberSubscription>): Promise<MemberSubscription> => {
  const response = await apiClient.put(`/api/subscriptions/${id}`, data);
  return response.data;
};

export const deleteSubscription = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/subscriptions/${id}`);
};

export const cancelSubscription = async (id: string): Promise<void> => {
  await updateSubscription(id, { status: 'cancelled' });
};
