import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { DEFAULT_CATEGORIES } from "@/lib/utils";

// GET all categories
export async function GET() {
  try {
    await dbConnect();

    // Check if we need to initialize with default categories
    const count = await Category.countDocuments();

    if (count === 0) {
      // Initialize with default categories
      await Category.insertMany(DEFAULT_CATEGORIES);
    }

    const categories = await Category.find().sort({ name: 1 });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
   const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST new category
export async function POST(request: NextResponse) {
  try {
    const body = await request.json();

    await dbConnect();
    const category = await Category.create(body);

    return NextResponse.json(
      { success: true, data: category },
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
