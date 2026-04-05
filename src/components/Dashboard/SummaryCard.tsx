import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  type: 'balance' | 'income' | 'expense';
}

export default function SummaryCard({ title, amount, icon: Icon, type }: SummaryCardProps) {
  const colors = {
    balance: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      icon: 'text-primary'
    },
    income: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      icon: 'text-emerald-500'
    },
    expense: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      icon: 'text-rose-500'
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-xl", colors[type].bg)}>
          <Icon className={cn("w-4 h-4", colors[type].icon)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-xl sm:text-2xl font-bold truncate", colors[type].text)}>
          {type === 'expense' && amount > 0 ? '-' : ''}
          {new Intl.NumberFormat('vi-VN').format(Math.abs(amount))}đ
        </div>
      </CardContent>
    </Card>
  );
}
