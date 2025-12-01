import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MemberSubscription } from '@/interfaces/MemberSubscription';
import * as subscriptionAPI from '@/api/subscriptions';
import { toast } from '@/hooks/use-toast';

export const useSubscriptions = () => {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: subscriptionAPI.getSubscriptions,
  });
};

export const useMemberSubscriptions = (memberId: string) => {
  return useQuery({
    queryKey: ['subscriptions', 'member', memberId],
    queryFn: () => subscriptionAPI.getSubscriptionsByMemberId(memberId),
    enabled: !!memberId,
  });
};

export const useActiveMemberSubscription = (memberId: string) => {
  return useQuery({
    queryKey: ['subscriptions', 'active', memberId],
    queryFn: async () => {
      const subscriptions = await subscriptionAPI.getSubscriptionsByMemberId(memberId);
      return subscriptions.find(s => s.status === 'active') || null;
    },
    enabled: !!memberId,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<MemberSubscription, 'id'>) => subscriptionAPI.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: 'Success',
        description: 'Subscription created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create subscription',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MemberSubscription> }) => 
      subscriptionAPI.updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: 'Success',
        description: 'Subscription updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update subscription',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => subscriptionAPI.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: 'Success',
        description: 'Subscription deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete subscription',
        variant: 'destructive',
      });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => subscriptionAPI.cancelSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: 'Success',
        description: 'Subscription cancelled successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription',
        variant: 'destructive',
      });
    },
  });
};
