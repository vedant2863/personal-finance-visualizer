"use client"
import { useTransactionContext } from '@/context/TransactionContext';
import { useState } from 'react';

const TransactionFilter = () => {
  const { categoryFilter, setCategoryFilter, typeFilter, setTypeFilter, dateRange, setDateRange, fetchTransactions } = useTransactionContext();
  const [startDate, setStartDate] = useState(dateRange.start);
  const [endDate, setEndDate] = useState(dateRange.end);

  const handleFilterChange = () => {
    setDateRange({ start: new Date(startDate), end: new Date(endDate) });
    fetchTransactions();
  };

  return (
    <div className="flex space-x-4 py-4">
      <div className="flex flex-col">
        <label className="text-sm font-medium">Start Date</label>
        <input
          type="date"
          value={startDate.toISOString().split('T')[0]}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium">End Date</label>
        <input
          type="date"
          value={endDate.toISOString().split('T')[0]}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium">Category</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Categories</option>
          {/* Render categories here */}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium">Type</label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <button
        onClick={handleFilterChange}
        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default TransactionFilter;
