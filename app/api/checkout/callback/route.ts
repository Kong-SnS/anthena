import { NextRequest, NextResponse } from "next/server"
import { getBill } from "@/lib/billplz"

export async function GET(request: NextRequest) {
  const billplzId = request.nextUrl.searchParams.get("billplz[id]")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  if (!billplzId) {
    return NextResponse.redirect(`${baseUrl}/cart?payment=failed`)
  }

  try {
    // --- Verify bill status from Billplz API (don't trust query params) ---
    const bill = await getBill(billplzId)

    if (bill.paid) {
      return NextResponse.redirect(`${baseUrl}/checkout/success?billplz_id=${billplzId}`)
    }

    return NextResponse.redirect(`${baseUrl}/cart?payment=failed`)
  } catch {
    // Fallback: if Billplz API fails, redirect to success anyway
    // (the webhook will handle the actual payment confirmation)
    return NextResponse.redirect(`${baseUrl}/checkout/success?billplz_id=${billplzId}`)
  }
}
