import { faker } from '@faker-js/faker';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Budget from '@/models/Budget';
import Transaction from '@/models/Transaction';

async function seed() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      Budget.deleteMany({}),
      Transaction.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    const CATEGORIES = [
      'Groceries', 'Rent', 'Utilities', 'Salary', 'Freelance',
      'Transport', 'Entertainment', 'Health', 'Education', 'Savings',
    ];

    // Insert categories
    const categories = await Category.insertMany(
      CATEGORIES.map(name => ({
        name,
        color: faker.color.rgb(),
        icon: faker.helpers.arrayElement(['tag', 'star', 'wallet', 'home']),
      }))
    );
    console.log(`Inserted ${categories.length} categories`);

    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    // Insert budgets
    const budgets = await Budget.insertMany(
      categories.map(cat => ({
        category: cat.name,
        amount: faker.number.int({ min: 100, max: 5000 }),
        month,
        year,
      }))
    );
    console.log(`Inserted ${budgets.length} budgets`);

    // Insert transactions
    const transactions = Array.from({ length: 50 }).map(() => {
      const category = faker.helpers.arrayElement(categories);
      const type = faker.helpers.arrayElement(['expense', 'income']);
      const amount = faker.number.int({ min: 50, max: 2000 });

      return {
        amount,
        description: faker.commerce.productName(),
        date: faker.date.between({
          from: new Date(year, month, 1),
          to: new Date(year, month + 1, 0),
        }),
        type,
        category: category.name,
      };
    });

    await Transaction.insertMany(transactions);
    console.log(`Inserted ${transactions.length} transactions`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
