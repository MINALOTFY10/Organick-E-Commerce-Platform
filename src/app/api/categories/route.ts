import { NextResponse } from "next/server";
import { getCategoryNames } from "@/actions/category-actions";

export async function GET() {
  const data = await getCategoryNames();
  return NextResponse.json(data);
}
