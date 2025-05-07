import TransactionFilter from '@/components/TransactionFilter';
import TransactionList from '@/components/TransactionList';
import AddTransactionForm from '@/components/AddTransactionForm';
import CategoriesOverview from '@/components/CategoriesOverview';

const TransactionPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <AddTransactionForm />
      <TransactionFilter />
      <CategoriesOverview />
      <TransactionList />
    </div>
  );
};

export default TransactionPage;
