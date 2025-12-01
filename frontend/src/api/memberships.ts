import { Membership } from '@/interfaces/Membership';
import { apiClient } from './client';

export const getMemberships = async (): Promise<Membership[]> => {
  const response = await apiClient.get('/api/memberships');
  return response.data;
};

export const getMembershipById = async (id: string): Promise<Membership | null> => {
  try {
    const response = await apiClient.get(`/api/memberships/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createMembership = async (data: Omit<Membership, 'id'>): Promise<Membership> => {
  const response = await apiClient.post('/api/memberships', data);
  return response.data;
};

export const updateMembership = async (id: string, data: Partial<Membership>): Promise<Membership> => {
  const response = await apiClient.put(`/api/memberships/${id}`, data);
  return response.data;
};

export const deleteMembership = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/memberships/${id}`);
};
