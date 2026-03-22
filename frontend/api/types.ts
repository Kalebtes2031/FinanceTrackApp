export type AccountType = 'bank' | 'mobile_money' | 'cash';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type CategoryType = 'income' | 'expense';

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  balance: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  account: number;
  to_account: number | null;
  amount: string;
  fee: string;
  type: TransactionType;
  category: number | null;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DashboardResponse {
  total_balance: string;
  balance_per_account: Array<{
    id: number;
    name: string;
    type: AccountType;
    currency: string;
    balance: string;
  }>;
  recent_transactions: Array<{
    id: number;
    type: TransactionType;
    amount: string;
    fee: string;
    description: string;
    created_at: string;
    account_id: number;
    account_name: string;
    to_account_id: number | null;
    to_account_name: string | null;
    category_id: number | null;
    category_name: string | null;
  }>;
  spending_by_category: Array<{
    category_name: string;
    total: string;
  }>;
}
