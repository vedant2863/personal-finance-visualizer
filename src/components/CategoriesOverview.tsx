"use client"
import { useTransactionContext } from '@/context/TransactionContext';

const CategoriesOverview = () => {
  const { categories, budgets } = useTransactionContext();

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-4 h-4" style={{ backgroundColor: category.color }}></span>
              <span>{category.name}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold">Budgets for Current Month</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <div key={budget.id} className="p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span>{budget.category}</span>
              <span>${budget.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesOverview;
