import { usePaymentMethods } from '@/hooks/useAnalytics';
import { DonutChart } from './DonutChart';
import { ChartError, DONUT_PALETTE, SkeletonChart, formatCurrency } from './shared';

export const PaymentMethodChart = () => {
  const { data, isLoading, error, refetch } = usePaymentMethods();
  if (isLoading) return <SkeletonChart height={260} />;
  if (error) return <ChartError label="payment methods" onRetry={() => refetch()} />;
  const rows = data?.data ?? [];
  const total = rows.reduce((s, r) => s + r.count, 0);

  return (
    <DonutChart
      slices={rows.map((r, i) => ({
        label: r.method,
        value: r.count,
        color: DONUT_PALETTE[i % DONUT_PALETTE.length],
        extra: formatCurrency(r.total),
      }))}
      centerTitle="Payments"
      centerValue={total}
      tooltipFormatter={(s) => `${s.value} · ${s.extra}`}
    />
  );
};
