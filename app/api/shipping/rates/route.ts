import { NextRequest, NextResponse } from "next/server"
import { checkRates } from "@/lib/easyparcel"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { send_postcode, send_state, weight } = body

    if (!send_postcode || !send_state || !weight) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Default pickup from warehouse (update with actual warehouse address)
    const rates = await checkRates({
      sender_postcode: "43200",
      sender_state: "Selangor",
      receiver_postcode: send_postcode,
      receiver_state: send_state,
      weight,
    })

    // Format rates for frontend
    const formattedRates = rates.map((r: any) => ({
      service_id: r.service_id,
      service_name: r.service_name || r.courier_name,
      courier_name: r.courier_name,
      price: parseFloat(r.price || r.rate),
      estimated_days: r.delivery || "2-4 days",
      service_type: r.service_detail,
    }))

    return NextResponse.json({ rates: formattedRates })
  } catch (err) {
    console.error("Shipping rates error:", err)
    return NextResponse.json({ error: "Failed to get shipping rates" }, { status: 500 })
  }
}
