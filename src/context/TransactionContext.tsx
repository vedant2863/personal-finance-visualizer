'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";
import { getCurrentMonthYear, getMonthRange } from '@/lib/utils';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  type: 'expense' | 'income';
  category: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Budget {
  id: string;
  category: string;
  amount: number;
  month: number;
  year: number;
}

interface TransactionContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  dateRange: { start: Date; end: Date };
  setDateRange: React.Dispatch<React.SetStateAction<{ start: Date; end: Date }>>;
  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  typeFilter: string;
  setTypeFilter: React.Dispatch<React.SetStateAction<string>>;
  currentPeriod: { month: number; year: number };
  setCurrentPeriod: React.Dispatch<React.SetStateAction<{ month: number; year: number }>>;
  fetchTransactions: () => void;
  fetchCategories: () => void;
  fetchBudgets: () => void;
  addTransaction: (transaction: Transaction) => Promise<Transaction>;
  updateTransaction: (id: string, transaction: Transaction) => Promise<Transaction>;
  deleteTransaction: (id: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const { month, year } = getCurrentMonthYear();
    return getMonthRange(month, year);
  });
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  // Current month/year for budget tracking
  const [currentPeriod, setCurrentPeriod] = useState<{ month: number; year: number }>(() => {
    const { month, year } = getCurrentMonthYear();
    return { month, year };
  });

  // Load transactions based on filters
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (dateRange.start && dateRange.end) {
        params.append('startDate', dateRange.start.toISOString());
        params.append('endDate', dateRange.end.toISOString());
      }

      if (categoryFilter) {
        params.append('category', categoryFilter);
      }

      if (typeFilter) {
        params.append('type', typeFilter);
      }

      const response = await fetch(`/api/transactions?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch transactions');
      }

      setTransactions(data.data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      toast({
        title: 'Error',
        description: (err as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch categories');
      }

      setCategories(data.data);
    } catch (err) {
      toast({
        title: 'Error',
        description: (err as Error).message,
        variant: 'destructive',
      });
    }
  };

  // Load budgets for current period
  const fetchBudgets = async () => {
    try {
      const { month, year } = currentPeriod;
      const response = await fetch(`/api/budgets?month=${month}&year=${year}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch budgets');
      }

      setBudgets(data.data);
    } catch (err) {
      toast({
        title: 'Error',
        description: (err as Error).message,
        variant: 'destructive',
      });
    }
  };

  // Add transaction
  const addTransaction = async (transaction: Transaction) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to add transaction');
      }

      setTransactions((prev) => [data.data, ...prev]);

      toast({
        title: 'Success',
        description: 'Transaction added successfully',
      });

      return data.data;
    } catch (err) {
      toast({
        title: 'Error',
        description: (err as Error).message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Update transaction
  const updateTransaction = async (id: string, transaction: Transaction) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to update transaction');
      }
      setTransactions((prev) => prev.map((t) => (t.id === id ? data.data : t)));
      toast({
        title: 'Success',
        description: 'Transaction updated successfully',
      });
      return data.data;
    } catch (err) {
      toast({
        title: 'Error',
        description: (err as Error).message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete transaction');
      }

      setTransactions((prev) => prev.filter((t) => t.id !== id));

      toast({
        title: 'Success',
        description: 'Transaction deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: (err as Error).message,
        variant: 'destructive',
      });
    }
  };

  const contextValue = {
    transactions,
    categories,
    budgets,
    loading,
    error,
    dateRange,
    setDateRange,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    currentPeriod,
    setCurrentPeriod,
    fetchTransactions,
    fetchCategories,
    fetchBudgets,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};
