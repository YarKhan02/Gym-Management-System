import { useNavigate } from 'react-router-dom';
import { useTopMembers } from '@/hooks/useAnalytics';
import { Badge } from '@/components/ui/badge';
import { ChartError, SkeletonChart, formatCurrency } from './shared';
import { formatDate } from '@/utils/dateHelpers';

const rankDisplay = (i: number) => {
  if (i === 0) return '🥇';
  if (i === 1) return '🥈';
  if (i === 2) return '🥉';
  return `#${i + 1}`;
};

export const TopMembersTable = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useTopMembers();
  if (isLoading) return <SkeletonChart height={320} />;
  if (error) return <ChartError label="top members" onRetry={() => refetch()} />;
  const rows = data?.data ?? [];

  if (rows.length === 0)
    return (
      <div className="text-sm text-muted-foreground p-6 text-center border border-dashed rounded">
        No records found
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase font-mono text-muted-foreground border-b">
            <th className="py-2 pr-3">Rank</th>
            <th className="py-2 pr-3">Member</th>
            <th className="py-2 pr-3 hidden sm:table-cell">Subs</th>
            <th className="py-2 pr-3">Total Paid</th>
            <th className="py-2 pr-3 hidden md:table-cell">Status</th>
            <th className="py-2 pr-3 hidden lg:table-cell">Joined</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.member_id}
              onClick={() => navigate(`/members/${r.member_id}`)}
              className="border-b last:border-0 hover:bg-accent/50 cursor-pointer"
            >
              <td className="py-2 pr-3 font-bold">{rankDisplay(i)}</td>
              <td className="py-2 pr-3 font-medium">{r.member_name}</td>
              <td className="py-2 pr-3 hidden sm:table-cell tabular-nums">{r.subscription_count}</td>
              <td className="py-2 pr-3 tabular-nums font-semibold">{formatCurrency(r.total_paid)}</td>
              <td className="py-2 pr-3 hidden md:table-cell">
                <Badge variant={r.is_active ? 'default' : 'secondary'} className="text-[10px]">
                  {r.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="py-2 pr-3 hidden lg:table-cell text-muted-foreground">
                {formatDate(r.join_date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
