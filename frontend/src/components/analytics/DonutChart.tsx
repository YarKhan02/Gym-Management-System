import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { EmptyState } from './shared';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
  extra?: string;
}

interface Props {
  slices: DonutSlice[];
  centerTitle?: string;
  centerValue?: string | number;
  tooltipFormatter?: (slice: DonutSlice) => string;
}

export const DonutChart = ({ slices, centerTitle, centerValue, tooltipFormatter }: Props) => {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (total === 0)
    return (
      <div style={{ height: 240 }}>
        <EmptyState />
      </div>
    );

  return (
    <div className="space-y-3">
      <div className="relative" style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={2}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
              {slices.map((s, i) => (
                <Cell key={i} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(_v, _n, item: any) => {
                const slice = slices.find((s) => s.label === item?.payload?.label);
                if (!slice) return '';
                return tooltipFormatter ? tooltipFormatter(slice) : `${slice.value}`;
              }}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 6,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerTitle && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {centerTitle}
            </span>
          )}
          {centerValue !== undefined && (
            <span className="text-2xl font-bold">{centerValue}</span>
          )}
        </div>
      </div>
      <ul className="space-y-1 text-xs">
        {slices.map((s) => {
          const pct = ((s.value / total) * 100).toFixed(0);
          return (
            <li key={s.label} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ background: s.color }}
              />
              <span className="flex-1 truncate">{s.label}</span>
              <span className="text-muted-foreground tabular-nums">
                {s.value} ({pct}%)
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
