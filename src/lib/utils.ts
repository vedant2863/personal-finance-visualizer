import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, startOfMonth, endOfMonth, getMonth, getYear } from "date-fns";

// Utility function for Tailwind CSS class merging
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Format date
export function formatDate(date) {
  if (!date) return '';
  
  let dateObj;
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }
  
  return format(dateObj, 'MMM d, yyyy');
}

// Get month range (start and end dates)
export function getMonthRange(month, year) {
  const date = new Date(year, month);
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

// Calculate the total spending by category
export function calculateCategoryTotals(transactions) {
  return transactions.reduce((acc, transaction) => {
    const { category, amount, type } = transaction;
    
    // Only include expenses
    if (type !== 'expense') return acc;
    
    if (!acc[category]) {
      acc[category] = 0;
    }
    
    acc[category] += amount;
    return acc;
  }, {});
}

// Calculate total income, expenses, and balance
export function calculateFinancialSummary(transactions) {
  return transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        summary.income += transaction.amount;
      } else {
        summary.expenses += transaction.amount;
      }
      
      summary.balance = summary.income - summary.expenses;
      return summary;
    },
    { income: 0, expenses: 0, balance: 0 }
  );
}

// Calculate budget progress
export function calculateBudgetProgress(budgets, categoryTotals) {
  return budgets.map((budget) => {
    const spent = categoryTotals[budget.category] || 0;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    
    return {
      ...budget,
      spent,
      remaining: budget.amount - spent,
      percentage: Math.min(percentage, 100), // Cap at 100%
      status: percentage < 80 ? 'good' : percentage < 100 ? 'warning' : 'exceeded',
    };
  });
}

// Get current month and year
export function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: getMonth(now),
    year: getYear(now),
  };
}

// Default categories
export const DEFAULT_CATEGORIES = [
  { name: 'Housing', color: '#FF6384', icon: 'home' },
  { name: 'Food', color: '#36A2EB', icon: 'utensils' },
  { name: 'Transportation', color: '#FFCE56', icon: 'car' },
  { name: 'Entertainment', color: '#4BC0C0', icon: 'film' },
  { name: 'Healthcare', color: '#9966FF', icon: 'stethoscope' },
  { name: 'Shopping', color: '#FF9F40', icon: 'shopping-bag' },
  { name: 'Personal', color: '#C9CBCF', icon: 'user' },
  { name: 'Bills', color: '#8AC926', icon: 'file-text' },
  { name: 'Education', color: '#1982C4', icon: 'book' },
  { name: 'Others', color: '#6A4C93', icon: 'more-horizontal' },
];

// Month names
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];