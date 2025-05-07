"use client"
import { useTransactionContext } from '@/context/TransactionContext';
import { useState } from 'react';

const AddTransactionForm = () => {
  const { addTransaction } = useTransactionContext();

  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction = {
      amount,
      description,
      category,
      type,
      date: new Date(),
    };
    await addTransaction(newTransaction);
    setAmount(0);
    setDescription('');
    setCategory('');
    setType('expense');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-300 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="p-2 w-full border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 w-full border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 w-full border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'expense' | 'income')}
          className="p-2 w-full border border-gray-300 rounded-md"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Add Transaction
      </button>
    </form>
  );
};

export default AddTransactionForm;
