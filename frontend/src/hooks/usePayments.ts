import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Payment } from '@/interfaces/Payment';
import * as paymentAPI from '@/api/payments';
import { toast } from '@/hooks/use-toast';
import { getBackendErrorMessage } from '@/utils/apiErrors';

export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: paymentAPI.getPayments,
  });
};

export const useMemberPayments = (memberId: string) => {
  return useQuery({
    queryKey: ['payments', 'member', memberId],
    queryFn: () => paymentAPI.getPaymentsByMemberId(memberId),
    enabled: !!memberId,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Payment, 'id'>) => paymentAPI.createPayment(data),
    onSuccess: (_payment, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      if (variables.member_id) {
        queryClient.invalidateQueries({ queryKey: ['subscriptions', 'member', variables.member_id, 'unpaid'] });
      }
      toast({
        title: 'Success',
        description: 'Payment recorded successfully',
      });
    },
    onError: (error) => {
      const description = getBackendErrorMessage(error, 'Failed to record payment');
      toast({
        title: 'Error',
        description,
        variant: 'destructive',
      });
    },
  });
};

export const useDuePayments = () => {
  return useQuery({
    queryKey: ['payments', 'due'],
    queryFn: paymentAPI.getDuePayments,
  });
};
