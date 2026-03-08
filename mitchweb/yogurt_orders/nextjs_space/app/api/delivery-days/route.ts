export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getNextDeliveryDays, formatDeliveryDay } from "@/lib/delivery-utils";

export async function GET() {
  try {
    const days = getNextDeliveryDays(8);
    const formatted = days.map((date) => ({
      date: date.toISOString(),
      label: formatDeliveryDay(date),
      dayOfWeek: date.getDay() === 2 ? "Martes" : "Viernes",
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Delivery days error:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
