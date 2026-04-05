import React, { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from 'lucide-react';

interface MonthPickerProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

export default function MonthPicker({ month, year, onChange }: MonthPickerProps) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const years = useMemo(() => {
    // Chỉ cho phép chọn từ 5 năm trước đến năm hiện tại
    const startYear = currentYear - 5;
    return Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i).reverse();
  }, [currentYear]);

  const months = useMemo(() => {
    // Nếu là năm hiện tại, chỉ cho phép chọn đến tháng hiện tại
    const maxMonth = year === currentYear ? currentMonth : 12;
    return Array.from({ length: maxMonth }, (_, i) => i + 1);
  }, [year, currentYear, currentMonth]);

  // Nếu lỡ người dùng đang ở một tháng trong tương lai (do logic cũ), tự động đưa về tháng hiện tại
  React.useEffect(() => {
    if (year === currentYear && month > currentMonth) {
      onChange(currentMonth, year);
    }
  }, [year, month, currentYear, currentMonth, onChange]);

  return (
    <div className="flex items-center gap-2">
      <CalendarDays className="w-4 h-4 text-muted-foreground" />
      <div className="flex gap-1">
        <Select
          value={month.toString()}
          onValueChange={(val) => onChange(parseInt(val), year)}
        >
          <SelectTrigger className="w-[110px] h-9">
            <SelectValue placeholder="Tháng" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m.toString()}>
                Tháng {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={year.toString()}
          onValueChange={(val) => {
            const newYear = parseInt(val);
            let newMonth = month;
            // Nếu chuyển sang năm hiện tại mà tháng cũ > tháng hiện tại, reset tháng
            if (newYear === currentYear && month > currentMonth) {
              newMonth = currentMonth;
            }
            onChange(newMonth, newYear);
          }}
        >
          <SelectTrigger className="w-[90px] h-9">
            <SelectValue placeholder="Năm" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
