import { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import SummaryCard from '../components/Dashboard/SummaryCard';
import ExpenseChart from '../components/Dashboard/ExpenseChart';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';
import MonthPicker from '../components/ui/month-picker';
import { Wallet, TrendingUp, TrendingDown, Plus, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { Transaction, TransactionFormData } from '../types';

export default function DashboardPage() {
  const [filter, setFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const { 
    transactions, 
    loading, 
    hasMore, 
    loadMore, 
    addTransaction, 
    deleteTransaction, 
    updateTransaction 
  } = useTransactions(filter);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Tính toán tổng thu/chi cho tháng đang lọc
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += Number(t.amount);
      else expense += Number(t.amount);
    });
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [transactions]);

  const handleFormSubmit = async (data: TransactionFormData) => {
    if (editingTransaction) {
      return await updateTransaction(editingTransaction.id, data);
    } else {
      return await addTransaction(data);
    }
  };

  const openEditForm = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-8 pb-20 sm:pb-8">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
            Xin chào! 👋
          </h2>
          <p className="text-sm text-foreground/60">Sổ tay thu chi cá nhân</p>
        </div>
        <MonthPicker
          month={filter.month}
          year={filter.year}
          onChange={(month, year) => setFilter({ month, year })}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Số dư tháng này"
          amount={balance}
          icon={Wallet}
          type="balance"
        />
        <SummaryCard
          title="Thu nhập tháng này"
          amount={totalIncome}
          icon={TrendingUp}
          type="income"
        />
        <SummaryCard
          title="Chi tiêu tháng này"
          amount={totalExpense}
          icon={TrendingDown}
          type="expense"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8">
        <ExpenseChart transactions={transactions} />
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        <TransactionList
          transactions={transactions}
          onDelete={deleteTransaction}
          onEdit={openEditForm}
          loading={loading && transactions.length === 0}
        />
        
        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={loading}
              className="rounded-full px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                'Xem thêm giao dịch'
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 sm:static sm:mt-8 sm:flex border border-card-foreground/5 sm:border-none sm:bg-transparent rounded-full shadow-xl sm:shadow-none bg-primary text-primary-foreground sm:text-foreground">
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex justify-center items-center w-14 h-14 sm:w-auto sm:h-auto sm:py-3 sm:px-6 rounded-full bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg transition-all z-20"
          title="Thêm giao dịch mới"
        >
          <Plus size={24} className="sm:mr-2" />
          <span className="hidden sm:inline font-medium">Thêm giao dịch mới</span>
        </button>
      </div>

      {/* Transaction Modal */}
      {isFormOpen && (
        <TransactionForm
          onSubmit={handleFormSubmit}
          onClose={closeForm}
          initialData={
            editingTransaction
            ? {
                amount: editingTransaction.amount.toString(),
                type: editingTransaction.type,
                category_id: editingTransaction.category_id,
                contact_id: editingTransaction.contact_id || '',
                note: editingTransaction.note || '',
                date: editingTransaction.date,
              }
            : undefined
          }
        />
      )}
    </div>
  );
}
