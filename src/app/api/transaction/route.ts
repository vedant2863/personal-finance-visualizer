import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { HydratedDocument } from "mongoose";
import { ITransaction } from "@/types/transaction"; // You should define this

// Util to build query object cleanly
const buildTransactionQuery = (
  params: URLSearchParams
): Record<string, string | { $gte?: Date; $lte?: Date }> => {
  const query: Record<string, string | { $gte?: Date; $lte?: Date }> = {};

  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  const category = params.get("category");
  const type = params.get("type");

  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  if (category) query.category = category;
  if (type) query.type = type;

  return query;
};

// GET all transactions
export async function GET(request: NextRequest) {
  try {
    const query = buildTransactionQuery(new URL(request.url).searchParams);

    await dbConnect();

    const transactions: HydratedDocument<ITransaction>[] =
      await Transaction.find(query).sort({ date: -1 });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    await dbConnect();

    const transaction: HydratedDocument<ITransaction> =
      await Transaction.create(body);

    return NextResponse.json(
      { success: true, data: transaction },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
