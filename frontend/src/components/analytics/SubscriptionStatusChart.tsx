import { useSubscriptionStatus } from '@/hooks/useAnalytics';
import { DonutChart } from './DonutChart';
import { CHART_COLORS, ChartError, SkeletonChart } from './shared';

const COLOR_BY_STATUS: Record<string, string> = {
  active: CHART_COLORS.success,
  expired: CHART_COLORS.secondary,
  cancelled: CHART_COLORS.warning,
};

export const SubscriptionStatusChart = () => {
  const { data, isLoading, error, refetch } = useSubscriptionStatus();
  if (isLoading) return <SkeletonChart height={260} />;
  if (error) return <ChartError label="subscription status" onRetry={() => refetch()} />;
  const rows = data?.data ?? [];
  const active = rows.find((r) => r.status === 'active')?.count ?? 0;

  return (
    <DonutChart
      slices={rows.map((r) => ({
        label: r.status.charAt(0).toUpperCase() + r.status.slice(1),
        value: r.count,
        color: COLOR_BY_STATUS[r.status] ?? CHART_COLORS.secondary,
      }))}
      centerTitle="Active"
      centerValue={active}
    />
  );
};
