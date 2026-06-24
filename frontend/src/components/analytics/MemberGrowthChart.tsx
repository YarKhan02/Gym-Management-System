import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useMemberGrowth } from '@/hooks/useAnalytics';
import { CHART_COLORS, ChartError, EmptyState, SkeletonChart } from './shared';

export const MemberGrowthChart = () => {
  const { data, isLoading, error, refetch } = useMemberGrowth();
  if (isLoading) return <SkeletonChart />;
  if (error) return <ChartError label="member growth" onRetry={() => refetch()} />;
  const rows = data?.data ?? [];
  if (rows.length === 0)
    return (
      <div style={{ height: 300 }}>
        <EmptyState />
      </div>
    );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={rows} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 6,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="new_members"
          stroke={CHART_COLORS.primary}
          fill={CHART_COLORS.primary}
          fillOpacity={0.15}
          strokeWidth={2}
          name="New Members"
        />
        <Area
          type="monotone"
          dataKey="cumulative"
          stroke={CHART_COLORS.secondary}
          fill="none"
          strokeWidth={1.5}
          strokeDasharray="4 2"
          name="Total"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
