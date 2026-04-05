import React, { useState, useEffect, useMemo } from 'react';
import type { TransactionFormData } from '../../types';
import { format } from 'date-fns';
import { Loader2, PlusCircle, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabase';
import { useContacts } from '@/hooks/useContacts';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => Promise<{ error: string | null }>;
  onClose: () => void;
  initialData?: TransactionFormData;
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string | null;
}

export default function TransactionForm({ onSubmit, onClose, initialData }: TransactionFormProps) {
  const { contacts } = useContacts();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<TransactionFormData>(
    initialData || {
      amount: '',
      type: 'expense',
      category_id: '',
      contact_id: '',
      note: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    }
  );
  
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from database
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setCategories(data || []);
        
        // Set default category if not editing
        if (!initialData && data && data.length > 0) {
          const firstMatch = data.find(c => c.type === formData.type);
          if (firstMatch) {
            setFormData(prev => ({ ...prev, category_id: firstMatch.id }));
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, [initialData, formData.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      setError('Vui lòng chọn danh mục');
      return;
    }
    setLoading(true);
    setError(null);
    
    const { error } = await onSubmit(formData);
    setLoading(false);
    
    if (error) {
      setError(error);
    } else {
      onClose();
    }
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    const firstMatch = categories.find(c => c.type === type);
    setFormData(prev => ({
      ...prev,
      type,
      category_id: firstMatch ? firstMatch.id : '', 
    }));
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  const selectedCategory = useMemo(() => 
    categories.find(c => c.id === formData.category_id),
  [categories, formData.category_id]);

  const showContactSelect = useMemo(() => {
    if (!selectedCategory) return false;
    const name = selectedCategory.name.toLowerCase();
    return name.includes('vay') || name.includes('nợ');
  }, [selectedCategory]);

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Sửa giao dịch' : 'Thêm giao dịch'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-xl">
            <Button
              type="button"
              variant={formData.type === 'expense' ? 'secondary' : 'ghost'}
              onClick={() => handleTypeChange('expense')}
              className={cn(
                "py-2 h-auto text-sm font-medium transition-all rounded-lg",
                formData.type === 'expense' && "bg-background text-rose-500 shadow-sm hover:bg-background"
              )}
            >
              Tiền chi
            </Button>
            <Button
              type="button"
              variant={formData.type === 'income' ? 'secondary' : 'ghost'}
              onClick={() => handleTypeChange('income')}
              className={cn(
                "py-2 h-auto text-sm font-medium transition-all rounded-lg",
                formData.type === 'income' && "bg-background text-emerald-500 shadow-sm hover:bg-background"
              )}
            >
              Tiền thu
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (đ)</Label>
            <Input
              id="amount"
              type="number"
              required
              min="1"
              value={formData.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="VD: 50000"
              className="text-lg py-6"
            />
          </div>

          <div className="space-y-2">
            <Label>Danh mục</Label>
            {loadingCategories ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {filteredCategories.map(cat => (
                  <Button
                    key={cat.id}
                    type="button"
                    variant={formData.category_id === cat.id ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, category_id: cat.id }))}
                    className={cn(
                      "rounded-full px-4 h-8",
                      formData.category_id === cat.id && "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    {cat.icon} {cat.name}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {showContactSelect && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="contact">Đối tượng (Người vay/nợ)</Label>
              <Select
                value={formData.contact_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, contact_id: value }))}
              >
                <SelectTrigger id="contact" className="py-6">
                  <SelectValue placeholder="Chọn người quen..." />
                </SelectTrigger>
                <SelectContent>
                  {contacts.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Chưa có danh sách người quen. Hãy thêm ở mục Danh bạ.
                    </div>
                  ) : (
                    contacts.map(contact => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="date">Ngày tháng</Label>
            <Input
              id="date"
              type="date"
              required
              value={formData.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="py-6"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Input
              id="note"
              type="text"
              value={formData.note}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Mô tả..."
              className="py-6"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-base font-semibold"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <PlusCircle className="mr-2 w-5 h-5" />
                  {initialData ? 'Cập nhật' : 'Lưu giao dịch'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
