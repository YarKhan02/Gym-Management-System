import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { usePlansAnalytics } from '@/hooks/useAnalytics';
import { CHART_COLORS, ChartError, EmptyState, SkeletonChart, formatCurrency } from './shared';
import { Star } from 'lucide-react';

export const PlanPopularityChart = () => {
  const { data, isLoading, error, refetch } = usePlansAnalytics();
  if (isLoading) return <SkeletonChart height={260} />;
  if (error) return <ChartError label="plans" onRetry={() => refetch()} />;
  const rows = data?.data ?? [];
  if (rows.length === 0)
    return (
      <div style={{ height: 240 }}>
        <EmptyState />
      </div>
    );

  const height = Math.max(200, rows.length * 60);
  const topId = rows.reduce((a, b) => (a.subscriber_count > b.subscriber_count ? a : b)).plan_id;

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={rows} layout="vertical" margin={{ top: 10, right: 32, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis
            type="category"
            dataKey="plan_name"
            tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
            width={100}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 6,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="subscriber_count" fill={CHART_COLORS.primary} name="Total Subscribers" />
          <Bar dataKey="active_count" fill={CHART_COLORS.blue} name="Active" />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {rows.map((p) => {
          const top = p.plan_id === topId;
          return (
            <div
              key={p.plan_id}
              className={`flex-shrink-0 min-w-[220px] p-3 rounded-md border-2 ${
                top ? 'border-amber-500/60 bg-amber-500/5' : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{p.plan_name}</span>
                {top && (
                  <span className="flex items-center gap-1 text-amber-500 text-[10px] font-mono uppercase">
                    <Star className="h-3 w-3 fill-current" /> Most Popular
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {p.subscriber_count} subscribers · {formatCurrency(p.total_revenue)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
