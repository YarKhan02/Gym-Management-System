import { Info } from 'lucide-react';

export const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--muted-foreground))',
  accent: 'hsl(var(--accent))',
  warning: '#FFD166',
  danger: '#FF6B6B',
  success: '#22c55e',
  blue: '#3b82f6',
  pink: '#ec4899',
  purple: '#a855f7',
};

export const DONUT_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.blue,
  CHART_COLORS.pink,
  CHART_COLORS.purple,
];

export const formatCurrency = (n: number) =>
  `PKR ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

export const formatCurrencyShort = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded-md ${className || 'h-28'}`} />
);

export const SkeletonChart = ({ height = 300 }: { height?: number }) => (
  <div className="animate-pulse bg-muted rounded-md w-full" style={{ height }} />
);

export const ChartError = ({
  label,
}: {
  label: string;
  onRetry?: () => void;
}) => (
  <div className="flex items-center gap-3 p-4 border border-border bg-muted/30 rounded-md text-sm text-muted-foreground">
    <Info className="h-4 w-4 text-primary flex-shrink-0" />
    <p className="flex-1">There's no {label} data to show yet.</p>
  </div>
);

export const EmptyState = ({ message = 'No data for this period' }: { message?: string }) => (
  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
    {message}
  </div>
);
