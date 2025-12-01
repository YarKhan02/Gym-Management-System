import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Member } from '@/interfaces/Member';
import * as memberAPI from '@/api/members';
import { toast } from '@/hooks/use-toast';

export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: memberAPI.getMembers,
  });
};

export const useMember = (id: string) => {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => memberAPI.getMemberById(id),
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<Member, 'id'>) => memberAPI.createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({
        title: 'Success',
        description: 'Member added successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add member',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Member> }) => 
      memberAPI.updateMember(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', variables.id] });
      toast({
        title: 'Success',
        description: 'Member updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update member',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => memberAPI.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast({
        title: 'Success',
        description: 'Member deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete member',
        variant: 'destructive',
      });
    },
  });
};
