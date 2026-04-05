import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Transaction, TransactionFormData } from '../types';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export interface TransactionFilter {
  month?: number; // 1-12
  year?: number;
  contactId?: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  allTransactions: Transaction[]; // Dùng cho biểu đồ hoặc tổng nợ
}

export function useTransactions(filter?: TransactionFilter) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    allTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  const fetchMonthlyStats = useCallback(async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          categories:category_id (*)
        `);

      // Chỉ lọc theo thời gian NẾU có filter tháng và năm
      if (filter?.month !== undefined && filter?.year !== undefined) {
        const date = new Date(filter.year, filter.month - 1, 1);
        const start = format(startOfMonth(date), 'yyyy-MM-dd');
        const end = format(endOfMonth(date), 'yyyy-MM-dd');
        query = query.gte('date', start).lte('date', end);
      }

      if (filter?.contactId) {
        query = query.eq('contact_id', filter.contactId);
      }

      const { data, error } = await query;

      if (error) throw error;

      let income = 0;
      let expense = 0;
      data?.forEach(t => {
        if (t.type === 'income') income += Number(t.amount);
        else expense += Number(t.amount);
      });

      setMonthlyStats({
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense,
        allTransactions: data || []
      });
    } catch (err) {
      console.error('Error fetching monthly stats:', err);
    }
  }, [user, filter?.month, filter?.year, filter?.contactId]);

  const fetchTransactions = useCallback(async (isLoadMore = false) => {
    if (!user) return;
    
    if (!isLoadMore) {
      setLoading(true);
      setPage(0);
      fetchMonthlyStats();
    }

    try {
      const currentPage = isLoadMore ? page + 1 : 0;
      let query = supabase
        .from('transactions')
        .select(`
          *,
          categories:category_id (*),
          contacts:contact_id (name)
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

      if (filter?.month !== undefined && filter?.year !== undefined) {
        const date = new Date(filter.year, filter.month - 1, 1);
        const start = format(startOfMonth(date), 'yyyy-MM-dd');
        const end = format(endOfMonth(date), 'yyyy-MM-dd');
        query = query.gte('date', start).lte('date', end);
      }

      if (filter?.contactId) {
        query = query.eq('contact_id', filter.contactId);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (isLoadMore) {
        setTransactions(prev => [...prev, ...(data || [])]);
        setPage(currentPage);
      } else {
        setTransactions(data || []);
      }

      setHasMore(data?.length === PAGE_SIZE);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi tải dữ liệu';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user, filter?.month, filter?.year, filter?.contactId, page, fetchMonthlyStats]);

  useEffect(() => {
    fetchTransactions();

    if (!user) return;

    const subscription = supabase
      .channel('transactions-changes-stats')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'transactions',
        filter: `user_id=eq.${user.id}` 
      }, 
      () => {
        fetchTransactions();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, filter?.month, filter?.year, filter?.contactId]);

  const addTransaction = async (data: TransactionFormData) => {
    if (!user) return { error: 'Không tìm thấy người dùng' };
    try {
      const { error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          amount: parseFloat(data.amount),
          type: data.type,
          category_id: data.category_id,
          contact_id: data.contact_id || null,
          note: data.note,
          date: data.date,
        }]);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      return { error: message };
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      return { error: message };
    }
  };

  const updateTransaction = async (id: string, data: TransactionFormData) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: parseFloat(data.amount),
          type: data.type,
          category_id: data.category_id,
          contact_id: data.contact_id || null,
          note: data.note,
          date: data.date,
        })
        .eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      return { error: message };
    }
  };

  return {
    transactions,
    monthlyStats,
    loading,
    error,
    hasMore,
    loadMore: () => fetchTransactions(true),
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refresh: () => fetchTransactions(false)
  };
}
