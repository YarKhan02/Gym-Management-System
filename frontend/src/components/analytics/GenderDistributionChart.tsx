import { useMemberDemographics } from '@/hooks/useAnalytics';
import { DonutChart } from './DonutChart';
import { CHART_COLORS, ChartError, SkeletonChart } from './shared';

const COLOR_BY_GENDER: Record<string, string> = {
  Male: CHART_COLORS.blue,
  Female: CHART_COLORS.pink,
  Other: CHART_COLORS.purple,
};

export const GenderDistributionChart = () => {
  const { data, isLoading, error, refetch } = useMemberDemographics();
  if (isLoading) return <SkeletonChart height={260} />;
  if (error) return <ChartError label="demographics" onRetry={() => refetch()} />;
  const rows = data?.gender ?? [];
  const total = rows.reduce((s, r) => s + r.count, 0);

  return (
    <DonutChart
      slices={rows.map((r) => ({
        label: r.label,
        value: r.count,
        color: COLOR_BY_GENDER[r.label] ?? CHART_COLORS.secondary,
      }))}
      centerTitle="Members"
      centerValue={total}
    />
  );
};
