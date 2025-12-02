import { useDashboard } from '@/hooks/useDashboard';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { Users, UserCheck, UserX, Wallet, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/dateHelpers';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading } = useDashboard();

  if (isLoading || !dashboardData) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const { stats, expiring_subscriptions, recent_payments } = dashboardData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your gym management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={stats.total_members}
          icon={Users}
          description="All registered members"
        />
        <StatCard
          title="Active Members"
          value={stats.active_members}
          icon={UserCheck}
          description="Members with active subscriptions"
        />
        <StatCard
          title="Expired"
          value={stats.expired_members}
          icon={UserX}
          description="Subscriptions expired"
        />
        <StatCard
          title="This Month Revenue"
          value={`PKR ${stats.month_revenue.toFixed(2)}`}
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
            data={expiring_subscriptions}
            columns={[
              {
                key: 'member',
                label: 'Member',
                render: (item) => item.member_name,
              },
              {
                key: 'membership',
                label: 'Plan',
                render: (item) => item.membership_name,
              },
              {
                key: 'end_date',
                label: 'Expires',
                render: (item) => (
                  <div className="flex items-center gap-2">
                    <span>{formatDate(item.end_date)}</span>
                    <Badge variant="destructive">
                      {item.days_until_expiry}d left
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
            data={recent_payments}
            columns={[
              {
                key: 'member',
                label: 'Member',
                render: (item) => item.member_name,
              },
              {
                key: 'amount',
                label: 'Amount',
                render: (item) => `PKR ${item.amount.toFixed(2)}`,
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
