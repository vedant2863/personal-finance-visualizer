export interface ITransaction {
  amount: number;
  category: string;
  type: "income" | "expense";
  date: Date;
  note?: string;
}
