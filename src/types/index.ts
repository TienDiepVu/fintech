export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category_id: string;
  contact_id?: string | null;
  note: string | null;
  date: string;
  created_at: string;
  categories?: {
    name: string;
    icon: string | null;
  };
  contacts?: {
    name: string;
  };
}

export interface TransactionFormData {
  amount: string;
  type: TransactionType;
  category_id: string;
  contact_id?: string;
  note: string;
  date: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  birthday: string | null;
  address: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface ProfileFormData {
  full_name: string;
  phone: string;
  birthday: string;
  address: string;
}
