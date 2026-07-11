import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyAdmin } from "@/lib/admin-auth"

// Cancel an order and restore its stock. Runs server-side with the service role
// so `decrement_stock` no longer needs to be callable by the `authenticated`
// role from the browser (which would let any signed-in user tamper with stock).
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin()
    if (!auth.authorized) return auth.response!

    const { order_id } = await request.json()
    if (!order_id) {
      return NextResponse.json({ error: "order_id is required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: order } = await supabase
      .from("orders")
      .select("status, order_items(product_id, quantity)")
      .eq("id", order_id)
      .single()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Only restore stock for orders that had previously decremented it.
    if (order.status === "paid" || order.status === "processing") {
      for (const item of order.order_items) {
        if (!item.product_id) continue
        await supabase.rpc("decrement_stock", {
          p_product_id: item.product_id,
          p_quantity: -item.quantity,
        })
      }
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", order_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Order cancel error:", err)
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
  }
}
