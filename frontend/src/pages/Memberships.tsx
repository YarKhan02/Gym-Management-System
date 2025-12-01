import { useState } from 'react';
import { useMemberships, useCreateMembership, useUpdateMembership, useDeleteMembership } from '@/hooks/useMemberships';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { MembershipForm } from '@/components/forms/MembershipForm';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Membership } from '@/interfaces/Membership';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Memberships = () => {
  const { data: memberships = [], isLoading } = useMemberships();
  const createMembership = useCreateMembership();
  const updateMembership = useUpdateMembership();
  const deleteMembership = useDeleteMembership();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const [membershipToDelete, setMembershipToDelete] = useState<string | null>(null);

  const handleCreateMembership = (data: Omit<Membership, 'id'>) => {
    createMembership.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleUpdateMembership = (data: Omit<Membership, 'id'>) => {
    if (editingMembership) {
      updateMembership.mutate(
        { id: editingMembership.id, data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingMembership(null);
          },
        }
      );
    }
  };

  const handleDeleteMembership = () => {
    if (membershipToDelete) {
      deleteMembership.mutate(membershipToDelete, {
        onSuccess: () => setMembershipToDelete(null),
      });
    }
  };

  const openEditModal = (membership: Membership) => {
    setEditingMembership(membership);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMembership(null);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Membership Plans</h1>
          <p className="text-muted-foreground">Manage your gym membership plans</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Plan
        </Button>
      </div>

      <DataTable
        data={memberships}
        columns={[
          {
            key: 'name',
            label: 'Plan Name',
          },
          {
            key: 'duration_days',
            label: 'Duration',
            render: (membership) => `${membership.duration_days} days`,
          },
          {
            key: 'price',
            label: 'Price',
            render: (membership) => `PKR ${membership.price.toFixed(2)}`,
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (membership) => (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(membership);
                  }}
                  className="gap-1 border-2"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMembershipToDelete(membership.id);
                  }}
                  className="gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={isModalOpen}
        onOpenChange={closeModal}
        title={editingMembership ? 'Edit Membership Plan' : 'Add New Membership Plan'}
        description={editingMembership ? 'Update plan details' : 'Create a new membership plan'}
      >
        <MembershipForm
          membership={editingMembership || undefined}
          onSubmit={editingMembership ? handleUpdateMembership : handleCreateMembership}
          onCancel={closeModal}
        />
      </Modal>

      <AlertDialog open={!!membershipToDelete} onOpenChange={() => setMembershipToDelete(null)}>
        <AlertDialogContent className="border-4 border-primary">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this membership plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMembership}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Memberships;
