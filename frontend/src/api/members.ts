import { Member } from '@/interfaces/Member';
import { apiClient } from './client';

export const getMembers = async (): Promise<Member[]> => {
  const response = await apiClient.get('/api/members');
  return response.data;
};

export const getMemberById = async (id: string): Promise<Member | null> => {
  try {
    const response = await apiClient.get(`/api/members/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createMember = async (memberData: Omit<Member, 'id'>): Promise<Member> => {
  const response = await apiClient.post('/api/members', memberData);
  return response.data;
};

export const updateMember = async (id: string, memberData: Partial<Member>): Promise<Member> => {
  const response = await apiClient.put(`/api/members/${id}`, memberData);
  return response.data;
};

export const deleteMember = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/members/${id}`);
};

export const searchMembers = async (query: string): Promise<Member[]> => {
  const members = await getMembers();
  const lowerQuery = query.toLowerCase();
  return members.filter(m => 
    m.full_name.toLowerCase().includes(lowerQuery) ||
    m.phone?.toLowerCase().includes(lowerQuery)
  );
};
