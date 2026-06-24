import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard = ({ title, value, icon: Icon, description }: StatCardProps) => {
  return (
    <Card className="border-4 border-primary">
      <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
        <CardTitle className="text-xs sm:text-sm font-bold uppercase truncate">{title}</CardTitle>
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="text-2xl sm:text-3xl font-bold truncate">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
