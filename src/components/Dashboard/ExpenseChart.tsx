import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { Transaction } from '../../types';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { useTheme } from '../../contexts/ThemeContext';

interface ExpenseChartProps {
  transactions: Transaction[];
  monthDate?: Date;
}

// Separate formatter to avoid lint issues with 'any' in JSX
// Recharts ValueType can be string | number | (string | number)[] | null | undefined
const formatCurrency = (value: any) => {
  if (value === undefined || value === null) return '';
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(Number(value));
};

export default function ExpenseChart({ transactions, monthDate = new Date() }: ExpenseChartProps) {
  const { theme } = useTheme();
  
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  const days = eachDayOfInterval({ start, end });

  const data = days.map(day => {
    const dayTransactions = transactions.filter(t => isSameDay(new Date(t.date), day));
    
    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      date: format(day, 'dd/MM'),
      'Thu nhập': income,
      'Chi tiêu': expense,
    };
  });

  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-card-foreground/5 h-[400px]">
      <h3 className="text-lg font-semibold text-foreground mb-6">Thống kê theo ngày</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 12 }}
            tickFormatter={(value: number) => `${value / 1000}k`}
            dx={-10}
          />
          <Tooltip 
            cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f1f5f9' }}
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
              borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
              borderRadius: '8px',
              color: theme === 'dark' ? '#f8fafc' : '#0f172a'
            }}
            formatter={formatCurrency}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="Thu nhập" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="Chi tiêu" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
