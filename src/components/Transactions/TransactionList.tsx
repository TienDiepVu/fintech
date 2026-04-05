import type { Transaction } from '../../types';
import { format } from 'date-fns';
import { Trash2, Edit2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  loading: boolean;
}

export default function TransactionList({ transactions, onDelete, onEdit, loading }: TransactionListProps) {
  if (loading && transactions.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="text-center p-12 border-dashed shadow-none bg-muted/30 mt-6">
        <div className="mx-auto w-12 h-12 bg-background rounded-full flex items-center justify-center mb-4 border shadow-sm">
          <ArrowDownCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">Chưa có giao dịch nào.</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Bấm nút + để thêm giao dịch đầu tiên nhé!</p>
      </Card>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">Lịch sử giao dịch</h3>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <Card 
            key={tx.id}
            className="group flex items-center justify-between p-3 sm:p-4 hover:shadow-md transition-all gap-2 sm:gap-4 border-none shadow-sm"
          >
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div 
                className={cn(
                  "p-2 sm:p-3 rounded-xl flex-shrink-0 flex items-center justify-center text-lg sm:text-xl",
                  tx.type === 'income' 
                    ? "bg-emerald-500/10 text-emerald-500" 
                    : "bg-rose-500/10 text-rose-500"
                )}
              >
                {tx.categories?.icon || (tx.type === 'income' ? '💰' : '💸')}
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">
                  {tx.categories?.name || 'Chưa phân loại'}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-sm text-muted-foreground mt-0.5">
                  <span className="flex-shrink-0">{format(new Date(tx.date), 'dd/MM/yyyy')}</span>
                  {tx.note && (
                    <>
                      <span className="w-0.5 h-0.5 bg-muted-foreground/30 rounded-full flex-shrink-0" />
                      <span className="truncate">{tx.note}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
              <span 
                className={cn(
                  "font-bold text-sm sm:text-lg whitespace-nowrap",
                  tx.type === 'income' ? "text-emerald-500" : "text-foreground"
                )}
              >
                {tx.type === 'income' ? '+' : '-'}
                {new Intl.NumberFormat('vi-VN').format(tx.amount)}đ
              </span>

              <div className="flex items-center gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(tx)}
                  className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <Edit2 size={14} className="sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc muốn xóa giao dịch này?')) {
                      onDelete(tx.id);
                    }
                  }}
                  className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
