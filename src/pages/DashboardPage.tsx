import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import SummaryCard from '../components/Dashboard/SummaryCard';
import ExpenseChart from '../components/Dashboard/ExpenseChart';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';
import { Wallet, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import type { Transaction, TransactionFormData } from '../types';

export default function DashboardPage() {
  const { transactions, loading, addTransaction, deleteTransaction, updateTransaction } = useTransactions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const calculateTotal = (type: 'income' | 'expense') => {
    return transactions
      .filter((t) => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalIncome = calculateTotal('income');
  const totalExpense = calculateTotal('expense');
  const balance = totalIncome - totalExpense;

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
      {/* Header cho Mobile: Xin chào */}
      <div className="flex sm:hidden justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
            Xin chào! 👋
          </h2>
          <p className="text-sm text-foreground/60">Sổ tay thu chi cá nhân</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Tổng số dư"
          amount={balance}
          icon={Wallet}
          type="balance"
        />
        <SummaryCard
          title="Tổng thu nhập"
          amount={totalIncome}
          icon={TrendingUp}
          type="income"
        />
        <SummaryCard
          title="Tổng chi tiêu"
          amount={totalExpense}
          icon={TrendingDown}
          type="expense"
        />
      </div>

      {/* Charts & Filters */}
      <div className="grid grid-cols-1 gap-8">
        <ExpenseChart transactions={transactions} />
      </div>

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        onDelete={deleteTransaction}
        onEdit={openEditForm}
        loading={loading}
      />

      {/* Floating Action Button cho Mobile / Button cho Desktop */}
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
