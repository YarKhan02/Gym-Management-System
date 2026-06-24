import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpiringSubscriptions } from '@/hooks/useAnalytics';
import { Badge } from '@/components/ui/badge';
import { ChartError, SkeletonChart } from './shared';
import { formatDate } from '@/utils/dateHelpers';

type Tab = 'all' | 'week' | 'month';

const badgeFor = (days: number) => {
  if (days <= 3) return { label: 'CRITICAL', cls: 'bg-destructive text-destructive-foreground' };
  if (days <= 7) return { label: 'URGENT', cls: 'bg-amber-500 text-black' };
  if (days <= 14) return { label: 'SOON', cls: 'bg-yellow-500 text-black' };
  return { label: 'UPCOMING', cls: 'bg-muted text-muted-foreground' };
};

export const ExpiringSubscriptionsTable = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useExpiringSubscriptions();
  const [tab, setTab] = useState<Tab>('all');
  const [showAll, setShowAll] = useState(false);

  const rows = useMemo(() => (data?.data ?? []).slice().sort((a, b) => a.days_remaining - b.days_remaining), [data]);
  const filtered = useMemo(() => {
    if (tab === 'week') return rows.filter((r) => r.days_remaining <= 7);
    if (tab === 'month') return rows.filter((r) => r.days_remaining <= 30);
    return rows;
  }, [rows, tab]);

  if (isLoading) return <SkeletonChart height={320} />;
  if (error) return <ChartError label="expiring subscriptions" onRetry={() => refetch()} />;

  const visible = showAll ? filtered : filtered.slice(0, 10);
  const counts = {
    all: rows.length,
    week: rows.filter((r) => r.days_remaining <= 7).length,
    month: rows.filter((r) => r.days_remaining <= 30).length,
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {(
          [
            ['all', `All (${counts.all})`],
            ['week', `This Week (${counts.week})`],
            ['month', `This Month (${counts.month})`],
          ] as [Tab, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-3 py-1.5 text-xs font-mono uppercase rounded border-2 transition-colors ${
              tab === k
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:bg-accent'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground p-6 text-center border border-dashed rounded">
          No records found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase font-mono text-muted-foreground border-b">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Member</th>
                <th className="py-2 pr-3 hidden sm:table-cell">Plan</th>
                <th className="py-2 pr-3 hidden md:table-cell">End Date</th>
                <th className="py-2 pr-3">Days</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r, i) => {
                const b = badgeFor(r.days_remaining);
                return (
                  <tr
                    key={r.member_id}
                    onClick={() => navigate(`/members/${r.member_id}`)}
                    className="border-b last:border-0 hover:bg-accent/50 cursor-pointer"
                  >
                    <td className="py-2 pr-3 text-muted-foreground">{i + 1}</td>
                    <td className="py-2 pr-3 font-medium">{r.member_name}</td>
                    <td className="py-2 pr-3 hidden sm:table-cell">{r.plan_name}</td>
                    <td className="py-2 pr-3 hidden md:table-cell">{formatDate(r.end_date)}</td>
                    <td className="py-2 pr-3 tabular-nums">{r.days_remaining}d</td>
                    <td className="py-2 pr-3">
                      <Badge className={`text-[10px] ${b.cls}`}>{b.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length > 10 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-3 text-xs text-primary hover:underline font-medium"
            >
              {showAll ? 'Show less' : `View all (${filtered.length})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
