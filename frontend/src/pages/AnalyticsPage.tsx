import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Seo } from '@/components/Seo';
import { OverviewCards } from '@/components/analytics/OverviewCards';
import { MemberGrowthChart } from '@/components/analytics/MemberGrowthChart';
import { RevenueTimelineChart } from '@/components/analytics/RevenueTimelineChart';
import { PlanPopularityChart } from '@/components/analytics/PlanPopularityChart';
import { SubscriptionStatusChart } from '@/components/analytics/SubscriptionStatusChart';
import { GenderDistributionChart } from '@/components/analytics/GenderDistributionChart';
import { PaymentMethodChart } from '@/components/analytics/PaymentMethodChart';
import { ExpiringSubscriptionsTable } from '@/components/analytics/ExpiringSubscriptionsTable';
import { TopMembersTable } from '@/components/analytics/TopMembersTable';

const ChartCard = ({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={`p-4 sm:p-5 ${className}`}>
    <h3 className="text-base sm:text-lg font-bold tracking-tight">{title}</h3>
    {subtitle && <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>}
    {!subtitle && <div className="mb-4" />}
    {children}
  </Card>
);

const AnalyticsPage = () => {
  const qc = useQueryClient();
  const refetchAll = () => qc.invalidateQueries({ queryKey: ['analytics'] });

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      <Seo
        title="Analytics | Gym Manager Pro"
        description="Live analytics dashboard with member growth, revenue, plans, and subscription insights."
        path="/analytics"
      />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-primary">
            Live Analytics
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">Command Overview</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time visibility across members, revenue, and operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono">Updated just now</span>
          <button
            onClick={refetchAll}
            className="flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-colors rounded"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
      </div>

      <OverviewCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <ChartCard
          title="Member Growth"
          subtitle="New signups and cumulative total"
          className="lg:col-span-3"
        >
          <MemberGrowthChart />
        </ChartCard>
        <ChartCard
          title="Monthly Revenue"
          subtitle="Payments collected per month"
          className="lg:col-span-2"
        >
          <RevenueTimelineChart />
        </ChartCard>
      </div>

      <ChartCard title="Membership Plans" subtitle="Popularity and revenue by plan">
        <PlanPopularityChart />
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ChartCard title="Subscription Status">
          <SubscriptionStatusChart />
        </ChartCard>
        <ChartCard title="Gender Distribution">
          <GenderDistributionChart />
        </ChartCard>
        <ChartCard title="Payment Methods">
          <PaymentMethodChart />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4">
        <ChartCard
          title="Expiring Subscriptions"
          subtitle="Members needing renewal attention"
          className="lg:col-span-6"
        >
          <ExpiringSubscriptionsTable />
        </ChartCard>
        <ChartCard
          title="Top Members"
          subtitle="By lifetime revenue"
          className="lg:col-span-5"
        >
          <TopMembersTable />
        </ChartCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;
