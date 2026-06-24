import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useRevenueTimeline } from '@/hooks/useAnalytics';
import {
  CHART_COLORS,
  ChartError,
  EmptyState,
  SkeletonChart,
  formatCurrency,
  formatCurrencyShort,
} from './shared';

export const RevenueTimelineChart = () => {
  const { data, isLoading, error, refetch } = useRevenueTimeline();
  if (isLoading) return <SkeletonChart />;
  if (error) return <ChartError label="revenue timeline" onRetry={() => refetch()} />;
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
        <YAxis
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={(v) => formatCurrencyShort(v as number)}
        />
        <Tooltip
          formatter={(v) => formatCurrency(v as number)}
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 6,
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={CHART_COLORS.primary}
          fill={CHART_COLORS.primary}
          fillOpacity={0.2}
          strokeWidth={2}
          name="Revenue"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
