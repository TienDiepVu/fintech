export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category_id: string;
  note: string | null;
  date: string;
  created_at: string;
  categories?: {
    name: string;
    icon: string | null;
  };
}

export interface TransactionFormData {
  amount: string;
  type: TransactionType;
  category_id: string;
  note: string;
  date: string;
}
