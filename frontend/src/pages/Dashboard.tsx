import { useMembers } from '@/hooks/useMembers';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { usePayments } from '@/hooks/usePayments';
import { useMemberships } from '@/hooks/useMemberships';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { Users, UserCheck, UserX, Wallet, AlertCircle } from 'lucide-react';
import { calculateTotalRevenue, getActiveMembers, getExpiredMembers } from '@/utils/calculations';
import { formatDate, isExpiringSoon, getDaysUntilExpiry } from '@/utils/dateHelpers';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: members = [] } = useMembers();
  const { data: subscriptions = [] } = useSubscriptions();
  const { data: payments = [] } = usePayments();
  const { data: memberships = [] } = useMemberships();

  const activeMembers = getActiveMembers(members, subscriptions);
  const expiredMembers = getExpiredMembers(members, subscriptions);
  const monthRevenue = calculateTotalRevenue(payments);

  const expiringSubscriptions = subscriptions
    .filter(sub => sub.status === 'active' && isExpiringSoon(sub.end_date, 7))
    .map(sub => {
      const member = members.find(m => m.id === sub.member_id);
      const membership = memberships.find(m => m.id === sub.membership_id);
      return { ...sub, member, membership };
    })
    .filter(sub => sub.member);

  const duePayments = expiredMembers.map(member => {
    const expiredSub = subscriptions.find(s => s.member_id === member.id && s.status === 'active');
    return { member, expiredSub };
  });

  const recentPayments = payments.slice(0, 5).map(payment => {
    const member = members.find(m => m.id === payment.member_id);
    return { ...payment, member };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your gym management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={members.length}
          icon={Users}
          description="All registered members"
        />
        <StatCard
          title="Active Members"
          value={activeMembers.length}
          icon={UserCheck}
          description="Members with active subscriptions"
        />
        <StatCard
          title="Expired"
          value={expiredMembers.length}
          icon={UserX}
          description="Subscriptions expired"
        />
        <StatCard
          title="This Month Revenue"
          value={`$${monthRevenue.toFixed(2)}`}
          icon={Wallet}
          description="Total payments received"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Expiring Soon (Next 7 Days)
          </h2>
          <DataTable
            data={expiringSubscriptions}
            columns={[
              {
                key: 'member',
                label: 'Member',
                render: (item) => item.member?.full_name || 'N/A',
              },
              {
                key: 'membership',
                label: 'Plan',
                render: (item) => item.membership?.name || 'N/A',
              },
              {
                key: 'end_date',
                label: 'Expires',
                render: (item) => (
                  <div className="flex items-center gap-2">
                    <span>{formatDate(item.end_date)}</span>
                    <Badge variant="destructive">
                      {getDaysUntilExpiry(item.end_date)}d left
                    </Badge>
                  </div>
                ),
              },
            ]}
            onRowClick={(item) => navigate(`/members/${item.member_id}`)}
            itemsPerPage={5}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Recent Payments
          </h2>
          <DataTable
            data={recentPayments}
            columns={[
              {
                key: 'member',
                label: 'Member',
                render: (item) => item.member?.full_name || 'N/A',
              },
              {
                key: 'amount',
                label: 'Amount',
                render: (item) => `$${item.amount.toFixed(2)}`,
              },
              {
                key: 'payment_date',
                label: 'Date',
                render: (item) => formatDate(item.payment_date),
              },
              {
                key: 'method',
                label: 'Method',
              },
            ]}
            itemsPerPage={5}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
