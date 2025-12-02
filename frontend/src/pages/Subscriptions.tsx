import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useMembers } from '@/hooks/useMembers';
import { useMemberships } from '@/hooks/useMemberships';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateHelpers';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const Subscriptions = () => {
  const navigate = useNavigate();
  const { data: subscriptions = [], isLoading } = useSubscriptions();
  const { data: members = [] } = useMembers();
  const { data: memberships = [] } = useMemberships();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const enrichedSubscriptions = subscriptions.map(sub => ({
    ...sub,
    member: members.find(m => m.id === sub.member_id),
    membership: memberships.find(m => m.id === sub.membership_id),
  }));

  const filteredSubscriptions = enrichedSubscriptions.filter(sub => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return sub.status === 'active';
    if (statusFilter === 'expired') return sub.status === 'expired';
    if (statusFilter === 'cancelled') return sub.status === 'cancelled';
    return true;
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Subscriptions</h1>
        <p className="text-muted-foreground">View all member subscriptions</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        data={filteredSubscriptions}
        columns={[
          {
            key: 'member',
            label: 'Member',
            render: (sub) => sub.member?.full_name || 'N/A',
          },
          {
            key: 'membership',
            label: 'Plan',
            render: (sub) => sub.membership?.name || 'N/A',
          },
          {
            key: 'start_date',
            label: 'Start Date',
            render: (sub) => formatDate(sub.start_date),
          },
          {
            key: 'end_date',
            label: 'End Date',
            render: (sub) => formatDate(sub.end_date),
          },
          {
            key: 'status',
            label: 'Status',
            render: (sub) => {
              const variant = 
                sub.status === 'active' ? 'default' :
                sub.status === 'expired' ? 'destructive' : 'secondary';
              const displayStatus = sub.status.charAt(0).toUpperCase() + sub.status.slice(1);
              return <Badge variant={variant}>{displayStatus}</Badge>;
            },
          },
        ]}
        onRowClick={(sub) => navigate(`/members/${sub.member_id}`)}
      />
    </div>
  );
};

export default Subscriptions;
