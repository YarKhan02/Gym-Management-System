import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Membership } from '@/interfaces/Membership';
import * as membershipAPI from '@/api/memberships';
import { toast } from '@/hooks/use-toast';

export const useMemberships = () => {
  return useQuery({
    queryKey: ['memberships'],
    queryFn: membershipAPI.getMemberships,
  });
};

export const useMembership = (id: string) => {
  return useQuery({
    queryKey: ['membership', id],
    queryFn: () => membershipAPI.getMembershipById(id),
    enabled: !!id,
  });
};

export const useCreateMembership = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Membership, 'id'>) => membershipAPI.createMembership(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      toast({
        title: 'Success',
        description: 'Membership plan created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create membership plan',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateMembership = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Membership> }) => 
      membershipAPI.updateMembership(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      toast({
        title: 'Success',
        description: 'Membership plan updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update membership plan',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteMembership = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => membershipAPI.deleteMembership(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      toast({
        title: 'Success',
        description: 'Membership plan deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete membership plan',
        variant: 'destructive',
      });
    },
  });
};
