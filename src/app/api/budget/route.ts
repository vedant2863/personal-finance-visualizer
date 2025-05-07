import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Budget from "@/models/Budget";

// GET all budgets for a month/year
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const month = parseInt(url.searchParams.get("month") || "");
    const year = parseInt(url.searchParams.get("year") || "");

    if (isNaN(month) || isNaN(year)) {
      return NextResponse.json(
        { success: false, error: "Month and year are required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const budgets = await Budget.find({ month, year }).sort({ category: 1 });

    return NextResponse.json({ success: true, data: budgets });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST new budget or update existing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, amount, month, year } = body as {
      category: string;
      amount: number;
      month: number;
      year: number;
    };

    await dbConnect();

    // Check if budget already exists for this category/month/year
    const existingBudget = await Budget.findOne({ category, month, year });

    let budget;
    if (existingBudget) {
      // Update existing budget
      existingBudget.amount = amount;
      budget = await existingBudget.save();
    } else {
      // Create new budget
      budget = await Budget.create(body);
    }

    return NextResponse.json(
      { success: true, data: budget },
      { status: existingBudget ? 200 : 201 }
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
