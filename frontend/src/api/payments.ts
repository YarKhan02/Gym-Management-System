import { Payment } from '@/interfaces/Payment';
import { apiClient } from './client';

export const getPayments = async (): Promise<Payment[]> => {
  const response = await apiClient.get('/api/payments');
  const payments = response.data;
  return payments.sort((a: Payment, b: Payment) => 
    new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
  );
};

export const getPaymentsByMemberId = async (memberId: string): Promise<Payment[]> => {
  const response = await apiClient.get(`/api/payments/member/${memberId}`);
  const payments = response.data;
  return payments.sort((a: Payment, b: Payment) => 
    new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
  );
};

export const createPayment = async (data: Omit<Payment, 'id'>): Promise<Payment> => {
  const response = await apiClient.post('/api/payments', data);
  return response.data;
};

export const getPaymentsByDateRange = async (startDate: string, endDate: string): Promise<Payment[]> => {
  const payments = await getPayments();
  return payments.filter(p => p.payment_date >= startDate && p.payment_date <= endDate);
};

export const getDuePayments = async (): Promise<any[]> => {
  const response = await apiClient.get('/api/payments/due');
  return response.data;
};
