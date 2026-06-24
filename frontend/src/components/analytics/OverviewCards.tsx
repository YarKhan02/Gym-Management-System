import { useAnalyticsOverview } from '@/hooks/useAnalytics';
import { Users, UserCheck, Wallet, CalendarDays, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ChartError, SkeletonCard, formatCurrency } from './shared';

const KpiCard = ({
  label,
  value,
  trend,
  trendDir,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  trend?: string;
  trendDir?: 'up' | 'down' | 'warn' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
}) => {
  const trendColor =
    trendDir === 'up'
      ? 'text-emerald-500'
      : trendDir === 'down'
        ? 'text-destructive'
        : trendDir === 'warn'
          ? 'text-amber-500'
          : 'text-muted-foreground';
  const TrendIcon =
    trendDir === 'up' ? TrendingUp : trendDir === 'down' ? TrendingDown : null;

  return (
    <Card className={`p-4 border-2 ${accent ?? ''}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">{value}</div>
      {trend && (
        <div className={`mt-1 text-xs flex items-center gap-1 ${trendColor}`}>
          {TrendIcon && <TrendIcon className="h-3 w-3" />}
          <span>{trend}</span>
        </div>
      )}
    </Card>
  );
};

export const OverviewCards = () => {
  const { data, isLoading, error, refetch } = useAnalyticsOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} className="h-28" />
        ))}
      </div>
    );
  }
  if (error || !data) return <ChartError label="overview" onRetry={() => refetch()} />;

  const retention = data.total_members
    ? ((data.active_members / data.total_members) * 100).toFixed(1)
    : '0';
  const growth = data.revenue_growth_percent;
  const expiringAccent =
    data.expiring_this_month > 10 ? 'border-amber-500/40' : 'border-emerald-500/30';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <KpiCard
        label="Total Members"
        value={data.total_members}
        trend={`+${data.new_members_this_month} this month`}
        trendDir={data.new_members_this_month >= data.new_members_last_month ? 'up' : 'down'}
        icon={Users}
      />
      <KpiCard
        label="Active Members"
        value={data.active_members}
        trend={`${retention}% retention`}
        trendDir="neutral"
        icon={UserCheck}
      />
      <KpiCard
        label="Monthly Revenue"
        value={formatCurrency(data.revenue_this_month)}
        trend={`${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% vs last mo`}
        trendDir={growth >= 0 ? 'up' : 'down'}
        icon={Wallet}
      />
      <KpiCard
        label="Active Subscriptions"
        value={data.active_subscriptions}
        trend={`of ${data.total_members} members`}
        trendDir="neutral"
        icon={CalendarDays}
      />
      <KpiCard
        label="Expiring (30 days)"
        value={data.expiring_this_month}
        trend={`${data.expiring_this_week} this week`}
        trendDir={data.expiring_this_month > 10 ? 'warn' : 'up'}
        icon={AlertCircle}
        accent={expiringAccent}
      />
    </div>
  );
};
