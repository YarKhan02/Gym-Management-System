import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Payment } from '@/interfaces/Payment';
import * as paymentAPI from '@/api/payments';
import { toast } from '@/hooks/use-toast';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: 'Success',
        description: 'Payment recorded successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to record payment',
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
