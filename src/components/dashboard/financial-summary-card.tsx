import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface FinancialSummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  className?: string;
  valueClassName?: string;
}

export function FinancialSummaryCard({
  title,
  value,
  description,
  icon,
  className,
  valueClassName,
}: FinancialSummaryCardProps) {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>{typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}

// Helper for cn if not globally available (though it should be)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
