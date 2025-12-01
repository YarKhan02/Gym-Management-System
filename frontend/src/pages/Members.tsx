import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembers, useCreateMember, useDeleteMember } from '@/hooks/useMembers';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { MemberForm } from '@/components/forms/MemberForm';
import { Plus, Search, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/dateHelpers';
import { Badge } from '@/components/ui/badge';
import { Member } from '@/interfaces/Member';
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

const Members = () => {
  const navigate = useNavigate();
  const { data: members = [], isLoading } = useMembers();
  const createMember = useCreateMember();
  const deleteMember = useDeleteMember();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateMember = (data: Omit<Member, 'id'>) => {
    createMember.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleDeleteMember = () => {
    if (memberToDelete) {
      deleteMember.mutate(memberToDelete, {
        onSuccess: () => setMemberToDelete(null),
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Members</h1>
          <p className="text-muted-foreground">Manage your gym members</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-2"
          />
        </div>
      </div>

      <DataTable
        data={filteredMembers}
        columns={[
          {
            key: 'full_name',
            label: 'Name',
          },
          {
            key: 'phone',
            label: 'Phone',
            render: (member) => member.phone || 'N/A',
          },
          {
            key: 'join_date',
            label: 'Join Date',
            render: (member) => formatDate(member.join_date),
          },
          {
            key: 'is_active',
            label: 'Status',
            render: (member) => (
              <Badge variant={member.is_active ? 'default' : 'secondary'}>
                {member.is_active ? 'Active' : 'Inactive'}
              </Badge>
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (member) => (
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setMemberToDelete(member.id);
                }}
                className="gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            ),
          },
        ]}
        onRowClick={(member) => navigate(`/members/${member.id}`)}
      />

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add New Member"
        description="Fill in the member details below"
      >
        <MemberForm
          onSubmit={handleCreateMember}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent className="border-4 border-primary">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this member and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMember}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Members;
