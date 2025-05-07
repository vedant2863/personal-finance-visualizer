"use client"
import { useTransactionContext } from '@/context/TransactionContext';

const TransactionList = () => {
  const { transactions, loading, deleteTransaction } = useTransactionContext();

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-center py-4">No transactions available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Amount</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-gray-200">
              <td className="p-4">{new Date(transaction.date).toLocaleDateString()}</td>
              <td className="p-4">{transaction.category}</td>
              <td className="p-4">{transaction.amount}</td>
              <td className="p-4">{transaction.type}</td>
              <td className="p-4 text-center">
                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
