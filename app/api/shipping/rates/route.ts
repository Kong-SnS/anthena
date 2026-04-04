import { NextRequest, NextResponse } from "next/server"
import { checkRates } from "@/lib/easyparcel"
import { getRegion, ALLOWED_CARRIERS } from "@/lib/shipping"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { send_postcode, send_state, weight } = body

    if (!send_postcode || !send_state || !weight) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Default pickup from warehouse
    const quotations = await checkRates({
      sender_postcode: "43200",
      sender_state: "Selangor",
      receiver_postcode: send_postcode,
      receiver_state: send_state,
      weight,
    })

    // Filter to allowed carriers based on region
    const region = getRegion(send_state)
    const allowed = ALLOWED_CARRIERS[region] || []

    const formattedRates = quotations
      .map((q: any) => ({
        service_id: q.courier?.service_id,
        service_name: q.courier?.service_name,
        courier_name: q.courier?.courier_name,
        courier_logo: q.courier?.courier_logo,
        price: parseFloat(q.pricing?.total_amount || "0"),
        is_pickup: q.courier?.is_pickup,
        is_dropoff: q.courier?.is_dropoff,
      }))
      .filter((r: any) =>
        allowed.some((name) => r.courier_name?.toLowerCase().includes(name.toLowerCase()))
      )

    return NextResponse.json({ rates: formattedRates })
  } catch (err) {
    console.error("Shipping rates error:", err)
    return NextResponse.json({ error: "Failed to get shipping rates" }, { status: 500 })
  }
}
