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

const formatCurrency = (value: any) => {
  if (value === undefined || value === null) return '';
  return new Intl.NumberFormat('vi-VN').format(Number(value)) + 'đ';
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
      date: format(day, 'dd'),
      fullDate: format(day, 'dd/MM/yyyy'),
      'Thu nhập': income,
      'Chi tiêu': expense,
    };
  });

  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-card-foreground/5 w-full">
      <h3 className="text-lg font-semibold text-foreground mb-6">Thống kê theo ngày</h3>
      <div className="w-full h-[300px] sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: -20, // Đẩy sang trái để tiết kiệm diện tích trên Mobile
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: textColor, fontSize: 10 }}
              dy={10}
              interval="preserveStartEnd" // Tự động ẩn nhãn nếu quá dày
              minTickGap={5} // Khoảng cách tối thiểu giữa các nhãn
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: textColor, fontSize: 10 }}
              tickFormatter={(value: number) => {
                if (value >= 1000000) return `${value / 1000000}M`;
                if (value >= 1000) return `${value / 1000}k`;
                return value.toString();
              }}
            />
            <Tooltip 
              cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f1f5f9' }}
              contentStyle={{ 
                backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              labelKey="fullDate"
              formatter={formatCurrency}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} 
              verticalAlign="bottom"
              align="center"
            />
            <Bar dataKey="Thu nhập" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={30} />
            <Bar dataKey="Chi tiêu" fill="#f43f5e" radius={[2, 2, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
