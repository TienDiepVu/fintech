import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  userId: string;
  createdAt: string;
}

export function useContacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name');

      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi tải danh sách người quen';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchContacts();

    if (!user) return;

    const subscription = supabase
      .channel('contacts-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'contacts',
        filter: `user_id=eq.${user.id}` 
      }, 
      () => {
        fetchContacts();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchContacts]);

  const addContact = async (name: string, phone?: string, email?: string) => {
    if (!user) return { error: 'Không tìm thấy người dùng' };
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          user_id: user.id,
          name,
          phone: phone || null,
          email: email || null,
        }]);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      return { error: message };
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      return { error: message };
    }
  };

  const updateContact = async (id: string, name: string, phone?: string, email?: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({
          name,
          phone: phone || null,
          email: email || null,
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
    contacts,
    loading,
    error,
    addContact,
    deleteContact,
    updateContact,
    refresh: fetchContacts
  };
}
