import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Transaction, TransactionFormData } from '../types';

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories:category_id (*)
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi tải dữ liệu';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();

    if (!user) return;

    // Realtime subscription
    const subscription = supabase
      .channel('transactions-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'transactions',
        filter: `user_id=eq.${user.id}` 
      }, 
      () => {
        // Chỉ cần gọi lại fetchTransactions để lấy dữ liệu chuẩn nhất từ DB
        fetchTransactions();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchTransactions]);

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
    loading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refresh: fetchTransactions
  };
}
