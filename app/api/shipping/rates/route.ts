import { NextRequest, NextResponse } from "next/server"
import { checkRates } from "@/lib/easyparcel"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { send_postcode, send_state, weight } = body

    if (!send_postcode || !send_state || !weight) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Default pickup from KL warehouse
    const rates = await checkRates({
      pick_postcode: "50000",
      pick_state: "Kuala Lumpur",
      send_postcode,
      send_state,
      weight,
    })

    return NextResponse.json({ rates })
  } catch (err) {
    console.error("Shipping rates error:", err)
    return NextResponse.json({ error: "Failed to get shipping rates" }, { status: 500 })
  }
}
