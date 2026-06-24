import { useDashboard } from '@/hooks/useDashboard';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable } from '@/components/ui/DataTable';
import { Users, UserCheck, UserX, Wallet, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/dateHelpers';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { PageHeaderSkeleton, StatGridSkeleton, TableSkeleton } from '@/components/ui/PageSkeleton';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading } = useDashboard();

  if (isLoading || !dashboardData) {
    return (
      <div className="space-y-4 sm:space-y-6 w-full overflow-x-hidden">
        <Seo title="Dashboard | Gym Manager Pro" description="Overview of members, subscriptions, payments, and gym performance." path="/" />
        <PageHeaderSkeleton />
        <StatGridSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="h-7 w-64 animate-pulse rounded-md bg-muted" />
            <TableSkeleton columns={3} rows={5} />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
            <TableSkeleton columns={4} rows={5} />
          </div>
        </div>
      </div>
    );
  }

  const { stats, expiring_subscriptions, recent_payments } = dashboardData;

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      <Seo title="Dashboard | Gym Manager Pro" description="Overview of members, subscriptions, payments, and gym performance." path="/" />
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Dashboard</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Overview of your gym management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">Expiring Soon (Next 7 Days)</span>
          </h2>
          <div className="overflow-x-auto">
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
                    <Badge variant="destructive" className="text-xs">
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
        </div>

        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">Recent Payments</span>
          </h2>
          <div className="overflow-x-auto">
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
    </div>
  );
};

export default Dashboard;
